import React, { useState, useEffect } from 'react';
import WebFont from 'webfontloader';



import FilerobotImageEditor, {
  TABS,
  TOOLS, 
} from 'react-filerobot-image-editor';

function Editor() {
  const [isImgEditorShown, setIsImgEditorShown] = useState(true);
  const [loadedDesignState, setLoadedDesignState] = useState(null);

  useEffect(() => {
    const storedDesignState = localStorage.getItem('savedDesignState');
    if (storedDesignState) {
      // Set the design state in the editor if it exists in local storage
      setLoadedDesignState(JSON.parse(storedDesignState));
    }
  }, []);


  const closeImgEditor = () => {
    setIsImgEditorShown(false);
  };

  return (
    <div style={{ width: '100%', height: '95vh' }}>
      {/* {isImgEditorShown && loadedDesignState && ( */}
      {isImgEditorShown && (
        <FilerobotImageEditor
        loadableDesignState={loadedDesignState}
          source="https://scaleflex.airstore.io/demo/stephen-walker-unsplash.jpg"
          onSave={(editedImageObject, designState) =>
            (
              console.log('savedDesignState', JSON.stringify(designState))
            )
          }

          onClose={closeImgEditor}
          annotationsCommon={{
            fill: '#ff0000',
          }}

          Text={
            { text: 'Editor...',
            fontSize: 30,
            fonts: [
              { label: 'Arial', value: 'Arial' },
              'Tahoma',
              'Sans-serif',
              { label: 'Comic Sans', value: 'Comic-sans' },
              { label: 'Zombie Holocaust', value: 'Zombie_Holocaust' },
            ],
            align: 'center',

            onFontChange: (newFontFamily, reRenderCanvasFn) => {
              reRenderCanvasFn(); // Re-render the canvas with the new font
            },
            
            }}
          Rotate={{ angle: 90, componentType: 'slider' }}
          Crop={{
            presetsItems: [
              {
                titleKey: 'classicTv',
                descriptionKey: '4:3',
                ratio: 4 / 3,
               
              },
              {
                titleKey: 'cinemascope',
                descriptionKey: '21:9',
                ratio: 21 / 9,
               
              },
            ],
            presetsFolders: [
              {
                titleKey: 'socialMedia', 
                groups: [
                  {
                    titleKey: 'facebook',
                    items: [
                      {
                        titleKey: 'profile',
                        width: 180,
                        height: 180,
                        descriptionKey: 'fbProfileSize',
                      },
                      {
                        titleKey: 'coverPhoto',
                        width: 820,
                        height: 312,
                        descriptionKey: 'fbCoverPhotoSize',
                      },
                    ],
                  },
                ],
              },
            ],
          }}
          tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK,TABS.FILTERS,TABS.FINETUNE]}
          defaultTabId={TABS.ANNOTATE} 
          defaultToolId={TOOLS.TEXT}
        />
      )}
    </div>
  );
}

export default Editor;
