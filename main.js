/*jshint laxcomma: true, browser: true, jquery: true, node: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/** Simple extension that adds a 'File > Hello World' menu item. Inserts 'Hello, world!' at cursor pos. */
define(function (require, exports, module) {
    'use strict';

    var CommandManager = brackets.getModule('command/CommandManager')
    , EditorManager  = brackets.getModule('editor/EditorManager')
    , WorkspaceManager = brackets.getModule('view/WorkspaceManager')
    , Menus          = brackets.getModule('command/Menus')
    , KeyBindingManager = brackets.getModule('command/KeyBindingManager')
    , NodeConnection = brackets.getModule('utils/NodeConnection')
    , AppInit = brackets.getModule('utils/AppInit')
    , Resizer = brackets.getModule('utils/Resizer')
    , ExtensionUtils = brackets.getModule('utils/ExtensionUtils')
    , Dialogs = brackets.getModule('widgets/Dialogs')
    ;

    var nodeConnection
    , vqReady = false
    , bottomPanel
    ;

    // Load stylesheet.
    ExtensionUtils.loadStyleSheet( module, 'main.css' );

    //var ProjectManager = brackets.getModule('project/ProjectManager');
    //var FileUtils = brackets.getModule('file/FileUtils');
    //var DocumentManager = brackets.getModule('document/DocumentManager');
    //var NativeApp = brackets.getModule('utils/NativeApp');
    //var Commands = brackets.getModule('command/Commands');


    // Helper function that chains a series of promise-returning
    // functions together via their done callbacks.
    function chain() {
        var functions = Array.prototype.slice.call(arguments, 0);
        if (functions.length > 0) {
            var firstFunction = functions.shift();
            var firstPromise = firstFunction.call();
            firstPromise.done(function () {
                chain.apply(null, functions);
            });
        }
    }


    // Helper function that tries to connect to node
    function connect() {
        var connectionPromise = nodeConnection.connect(true)
        .then(function () {
            console.log('[vocQuery] Connected to nodejs!');
            vqReady = true;
        })
        .fail(function () {
            console.error('[vocQuery] failed to connect');
            vqReady = false;
        });

        return connectionPromise;
    }

    // Helper function that loads our domain into the node server
    function loadVqDomain() {
        var path    = ExtensionUtils.getModulePath(module, 'node/vqDomain'),
        loadPromise = nodeConnection.loadDomains([path], true);

        loadPromise.fail(function (err) {
            console.error('[vocQuery] failed to load vq domain');
            console.error(err);
        });

        return loadPromise;
    }


    // Function to Execute Text as VocQuery
    // TODO: [x]Execute vocQ command
    function executeVocQuery(text) {
        nodeConnection.domains.vq.execVq(null, text)
        .fail(function (err) {
            console.error('[vocQuery] failed to run vocQuery');
            console.error(err);
        })
        .done(function (result) {
            console.log('[vocQuery] ' + result);
        });
    }

    // Function to Execute Text as SQL
    // TODO: Execute SQL command
    function executeSQL(text) {
        nodeConnection.domains.vq.execSql(null, text)
        .fail(function (err) {
            console.error('[vocQuery SQL] failed to run vocQuery SQL');
            console.error(err);
        })
        .done(function (result) {
            console.log('[vocQuery SQL] ' + result);
        });
    }

    // Function to run when the menu item is clicked
    function handleSelection() {
        var editor = EditorManager.getActiveEditor();
        if (editor) {
            // TODO: [x]Get selected text
            var selectedText = editor.getSelectedText();
            if (selectedText !== '' && vqReady) {
                Dialogs.showModalDialog('vq.brackets-cmd', 'vocQuery', '<code><pre>' + selectedText + '</pre></code>',  [{
                   className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
                   id: 'vq',
                   text: 'Run vocQuery'
                }, {
                   className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
                   id: 'sql',
                   text: 'Run SQL'
                }, {
                    className: Dialogs.DIALOG_BTN_CLASS_NORMAL,
                   id: Dialogs.DIALOG_BTN_CANCEL,
                   text: 'Cancel'
                }])
                .done(function (id) {
                    // If canceld
                    if (id === 'cancel') return;
                    if (id === 'vq') {
                        executeVocQuery(selectedText);
                    } else if (id === 'sql') {
                        executeSQL(selectedText);
                    }
                });
            }
        }
    }



    AppInit.appReady(function () {
        // First, register a command - a UI-less object associating an id to a handler
        var VQ_GET_SELECTION = 'vqBrackets.getSelection';   // package-style naming to avoid collisions
        CommandManager.register('Run vocQuery', VQ_GET_SELECTION, handleSelection);

        // Then create a menu item bound to the command
        // The label of the menu item is the name we gave the command (see above)
        var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
        menu.addMenuDivider();
        // NOTE: Execute hotkey
        menu.addMenuItem(VQ_GET_SELECTION, 'Alt-Q');
        menu.addMenuDivider();

        //TODO Beautify Panel
        var panelHtml = require("text!html/panel.html")
        , $vqIcon = $( '<a href="#" title="vocQuery" id="brackets-vq-icon"></a>' )
        , $vqPanel
        ;
        bottomPanel = WorkspaceManager.createBottomPanel('vq.bottom-panel', $(panelHtml),200);
        $vqPanel = $('#brackets-vq-panel');
        $vqPanel
        .on('click', '.close', function() {
            $vqIcon.removeClass('active');
            Resizer.hide($vqPanel);
        })
        .on('click', '[data-target="clear"]', function() {
            $('.table-container .table', $vqPanel).html('');
        })
        //TODO[x] Fix Uncaught TypeError: Cannot call method 'getSelectedText' of null
        .on('click', '[data-target="query"]', function() {
            executeVocQuery(EditorManager.getFocusedEditor().getSelectedText());
        })
        //TODO[x] Fix Uncaught TypeError: Cannot call method 'getSelectedText' of null
        .on('click', '[data-target="sql"]', function() {
            console.log(EditorManager.getActiveEditor());
            executeSQL(EditorManager.getActiveEditor().getSelectedText());
        })
        ;

        // Add listener for toolbar icon..
        $vqIcon.click( function() {
            Resizer.toggle($vqPanel);
            $(this).toggleClass('active');
        } ).appendTo( '#main-toolbar .buttons' );


        nodeConnection = new NodeConnection();
        $(nodeConnection)
        .on('vq.console', function (evt, data) {
            console.log('[vocQuery] ' + data);
        })
        .on('vq.error', function (evt, data) {
            console.error('[vocQuery] ' + data);
        })
        .on('vq.modal', function (evt, data) {
            Dialogs.showModalDialog('vq.brackets-result', 'vocQuery', data);
        })
        .on('vq.panel', function (evt, data) {
            if (!bottomPanel.isVisible()) {
                $vqIcon.addClass('active');
                bottomPanel.show();
            }
           $('.table-container .table', $vqPanel).append('<tr><td>' + data + '</td></tr>');
        })
        .on('vq.table', function (evt, data) {
            //Panel.show(data);
            console.log('.on(\'vq.table\') was called');
        });
        chain(connect, loadVqDomain);
    });

});
