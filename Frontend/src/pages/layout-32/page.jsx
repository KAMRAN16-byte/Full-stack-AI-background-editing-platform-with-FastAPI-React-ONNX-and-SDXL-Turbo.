import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProject } from '@/context/project-context';
import uploadAnimation from '@/assets/upload_image.json';
import image_icon from '@/assets/image.svg';
import Lottie from "lottie-react";
import axios from "axios";
import { useState } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/layout-32/components/toolbar';
import { useEffect } from 'react';

export function Layout32Page() {
  const [loading, setloading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { selectedProject } = useProject();
  const [prompt, setPrompt] = useState('');


  useEffect(() => {
    setTimeout(() => { setloading(false) }, 1500)
  }, [])

  const handleFileChange = (event) => {

    const selectedFile = event.target.files[0];

    if (selectedFile) {

      setFile(selectedFile);

      const imageUrl = URL.createObjectURL(selectedFile);

      setPreview(imageUrl);

      setResult(null);

    }
  };

  const processImage = async () => {

    if (!file) return;

    try {

      setProcessing(true);

      const formData = new FormData();

      formData.append('file', file);

      formData.append('mode', selectedProject.mode);

      formData.append('prompt', prompt);

      const response = await axios.post(
        'http://192.168.0.2:8000/process-image',
        formData,
        {
          responseType: 'blob',
        }
      );

      const imageUrl = URL.createObjectURL(response.data);

      setResult(imageUrl);

    } catch (error) {

      console.error('Error processing image:', error);

    } finally {

      setProcessing(false);

    }
  };

  return (
    <>
      <Toolbar>
        <ToolbarHeading>
          <div className="flex items-center gap-2">
            <ToolbarPageTitle>{selectedProject.mode === 'remove' ? 'AI Background Remover' : 'AI Background Fill'} </ToolbarPageTitle>
            <Badge size="sm" appearance="light">
              Free
            </Badge>
          </div>
          <ToolbarDescription>
            {selectedProject.mode === 'remove' ? 'Remove backgrounds instantly using BRIA RMBG-2.0 AI processing.' : 'Extend and generate realistic image backgrounds effortlessly using advanced AI technology.'}
          </ToolbarDescription>
        </ToolbarHeading>
        
      </Toolbar>

      <div className="px-4 py-5 lg:px-8">
        {loading ? (<Skeleton
          className="rounded-lg grow h-[calc(100vh-10rem)] mt-10 mb-5 border border-dashed border-input bg-background text-subtle-stroke relative text-border"
          style={{
            backgroundImage:
              'repeating-linear-gradient(125deg, transparent, transparent 5px, currentcolor 5px, currentcolor 6px)',
          }}
        ></Skeleton>) : (
          <div className='flex flex-col rounded-lg p-4 mt-10 mb-5 border justify-center items-center gap-3'>
            <div className='flex flex-col lg:flex-row w-full gap-4 lg:h-[calc(100vh-20rem)]'>
              <div className='flex flex-col rounded-lg border flex-1 min-h-0 overflow-hidden p-6'>
                {selectedProject.mode === 'remove' ? (
                  <>
                    <h2 className='text-lg font-medium mb-4'>
                      1. Upload your image
                    </h2>

                    {preview ? (
                      <div className='flex-1 border border-dashed rounded-xl flex justify-center items-center overflow-hidden'>
                        <img
                          src={preview}
                          alt="Preview"
                          className='max-w-full max-h-full object-contain p-4'
                        />
                      </div>
                    ) : (
                      <label
                        htmlFor="file-upload"
                        className='flex-1 w-full cursor-pointer'
                      >
                        <div className='border border-dashed rounded-xl w-full h-full flex flex-col justify-center items-center gap-4'>
                          <Lottie
                            animationData={uploadAnimation}
                            loop={true}
                            className='w-24 h-24 lg:w-48 lg:h-48'
                          />

                          <div className='text-center'>
                            <p className='text-lg font-medium'>
                              Drag & Drop
                            </p>

                            <p className='text-muted-foreground'>
                              or browse
                            </p>
                          </div>

                          <p className='text-sm text-muted-foreground text-center px-4'>
                            Supports JPG, PNG, JPEG
                          </p>
                        </div>

                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          className='hidden'
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </>
                ) : (
                  <>
                    <div className='flex flex-col w-full p-4 lg:p-6 gap-4'>
                      <h2 className='text-lg font-medium flex-start self-start'>
                        1. Describe the background you want to replace with.
                      </h2>
                      {/* PROMPT BOX */}
                      <div className='border border-dashed rounded-xl w-full  min-h-[120px] lg:h-[180px] p-4'>
                        <textarea
                          placeholder='Describe background you want...'
                          className='w-full h-full bg-transparent outline-none resize-none text-sm lg:text-base'
                          value={prompt}
                          onChange={(event) => setPrompt(event.target.value)}
                          required
                        />
                      </div>

                      {/* IMAGE UPLOAD */}
                      {preview ? (
                        <>
                          <h2 className='text-lg font-medium flex-start self-start'>
                            2. Your uploaded image
                          </h2>
                          <div className='border border-dashed rounded-xl w-full  h-[260px] lg:h-[380px] flex justify-center items-center'>
                            <img
                              src={preview}
                              alt="Preview"
                              className='w-full h-auto max-h-[400px] object-contain rounded-lg p-2 lg:p-4'
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <h2 className='text-lg font-medium flex-start self-start'>
                            2. Your uploaded image
                          </h2>
                          <label
                            htmlFor="file-upload"
                            className='w-full cursor-pointer'
                          >
                            <div className='border border-dashed rounded-xl w-full min-h-[220px] lg:h-[380px] flex flex-col justify-center items-center gap-4 p-4'>
                              <Lottie
                                animationData={uploadAnimation}
                                loop={true}
                                className='w-24 h-24 lg:w-50 lg:h-50'
                              />

                              <div className='text-center'>
                                <p className='text-lg font-medium'>
                                  Drag & Drop
                                </p>

                                <p className='text-muted-foreground'>
                                  or browse
                                </p>
                              </div>

                              <p className='text-sm text-muted-foreground text-center px-4'>
                                Supports JPG, PNG, JPEG
                              </p>
                            </div>

                            <input
                              id="file-upload"
                              type="file"
                              accept="image/*"
                              className='hidden'
                              onChange={handleFileChange}
                            />
                          </label>
                        </>
                      )}
                    </div>
                  </>
                )}

              </div>

              <div className='rounded-lg border flex-1 overflow-hidden min-h-[300px] lg:min-h-0'>
                <div className='flex flex-col h-full w-full'>

                  <div className='p-6 border-b shrink-0'>
                    <h2 className='text-lg font-medium'>
                      {selectedProject.mode === 'remove'
                        ? '2. Processed Image'
                        : '3. Processed Image'}
                    </h2>
                  </div>

                  <div className='flex-1 flex items-center justify-center p-4 min-h-[250px] lg:min-h-0'>
                    {processing ? (
                      <Skeleton
                        className="w-full h-[250px] lg:h-full border border-dashed border-input rounded-lg"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(125deg, transparent, transparent 5px, currentcolor 5px, currentcolor 6px)',
                        }}
                      />
                    ) : result ? (
                      <img
                        src={result}
                        alt="Preview"
                        className='max-w-full max-h-full object-contain rounded-lg'
                      />
                    ) : (
                      <div className='text-center'>
                        <p className='text-lg font-medium'>
                          No Result Yet
                        </p>

                        <p className='text-sm text-muted-foreground mt-2'>
                          Your processed image will appear here, Upload an image and click
                          "Process Image" to begin.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
            <div className='flex justify-center p-4'>
              <Button variant="primary" size="lg" onClick={processImage} disabled={!file || processing}>
                {processing ? 'Processing...' : 'Process Image'}
              </Button>
            </div>
          </div >
        )
        }

      </div >
    </>
  );
}
