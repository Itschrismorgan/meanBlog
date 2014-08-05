CKEDITOR.plugins.add('flickr-embed',{
    'icons' : 'flickr-embed',
    'init' : function(editor) {
        CKEDITOR.dialog.add( 'flickrEmbedDialog', this.path + 'dialogs/flickr-embed.js' );
        editor.addCommand( 'flickrEmbedDialog', new CKEDITOR.dialogCommand( 'flickrEmbedDialog' ) );
        editor.ui.addButton('Flickr-Embed',{
            'label' : 'Insert Flickr Photo',
            'command' : 'flickrEmbedDialog',
            'toolbar' : 'insert'
        });
    }
});