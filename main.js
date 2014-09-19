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
        ;
    
        //var ProjectManager = brackets.getModule('project/ProjectManager');
        //var FileUtils = brackets.getModule('file/FileUtils');
        //var DocumentManager = brackets.getModule('document/DocumentManager');
        //var NativeApp = brackets.getModule('utils/NativeApp');
        //var Commands = brackets.getModule('command/Commands');

    // Function to run when the menu item is clicked
    function handleSelectiont() {
        var editor = EditorManager.getFocusedEditor();
        if (editor) {
            // TODO: [x]Get selected text
            var selectedText = editor.getSelectedText();
            if(selectedText !== '') {
                // TODO: Execute command
                console.log(selectedText);
            }
        }
    }


    // First, register a command - a UI-less object associating an id to a handler
    var VQ_GET_SELECTION = 'vqBrackets.getSelection';   // package-style naming to avoid collisions
    CommandManager.register('vocQyery', VQ_GET_SELECTION, handleSelectiont);

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuDivider();
    // NOTE: Execute hotkey
    menu.addMenuItem(VQ_GET_SELECTION,'Alt-Q');
});