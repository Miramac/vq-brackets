/*jshint laxcomma: true, browser: true, jquery: true, node: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/** Simple extension that adds a 'File > Hello World' menu item. Inserts 'Hello, world!' at cursor pos. */
define(function (require, exports, module) {
    'use strict';

    var CommandManager = brackets.getModule('command/CommandManager')
        , EditorManager  = brackets.getModule('editor/EditorManager')
        , Menus          = brackets.getModule('command/Menus')
        , KeyBindingManager = brackets.getModule("command/KeyBindingManager")
        , NodeConnection = brackets.getModule("utils/NodeConnection")
        , AppInit = brackets.getModule("utils/AppInit")
        , ExtensionUtils = brackets.getModule("utils/ExtensionUtils")
        ;
    
    var nodeConnection
        , vqReady = false;
        ;
    
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
    
    AppInit.appReady(function () {
        nodeConnection = new NodeConnection();
        // Helper function that tries to connect to node
        function connect() {
            var connectionPromise = nodeConnection.connect(true);
            
            connectionPromise.fail(function () {
                console.error("[vq-brackets] failed to connect to node");
            });
            
            return connectionPromise;
        }
        
        // Helper function that loads our domain into the node server
        function loadVqDomain() {
            var path        = ExtensionUtils.getModulePath(module, "node/vqDomain"),
                loadPromise = nodeConnection.loadDomains([path], true);
            
            loadPromise.fail(function () {
                console.log("[vq-brackets] failed to load vq domain");
            });
            
            return loadPromise;
        }
        
        $(nodeConnection).on("vq.update", function (evt, data) {
            console.log("[vq-brackets] " + data);
        });
        vqReady = true;
        chain(connect, loadVqDomain);
    });
    
    
    // Function to run when the menu item is clicked
    function handleSelectiont() {
        var editor = EditorManager.getFocusedEditor();
        if (editor) {
            // TODO: [x]Get selected text
            var selectedText = editor.getSelectedText();
            if(selectedText !== '' && vqReady) {
                // TODO: Execute command
                nodeConnection.domains.vq.execVq(null, selectedText)
                .fail(function (err) {
                    console.error("[vq-brackets] failed to run vocQuery");
                    console.error(err);
                })
                .done(function (result) {
                    console.log("[vq-brackets] " + result);
                });
                
            }
        }
    }


    // First, register a command - a UI-less object associating an id to a handler
    var VQ_GET_SELECTION = 'vqBrackets.getSelection';   // package-style naming to avoid collisions
    CommandManager.register('Run vocQuery', VQ_GET_SELECTION, handleSelectiont);

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuDivider();
    // NOTE: Execute hotkey
    menu.addMenuItem(VQ_GET_SELECTION,'Alt-Q');
});