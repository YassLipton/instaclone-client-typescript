import React, { ChangeEvent, useState } from "react"
import { API_URI } from "../../App"
import { User } from "../models"

const CreatePostModal = (props: {
  isOpen: boolean,
  CloseModal: () => void,
  userInfos: User
}) => {
  const [currentViewIndex, setCurrentViewIndex] = useState<number>(0)
  const [imageToUpload, setImageToUpload] = useState<File>()
  const [previewImageUrl, setPreviewImageUrl] = useState<string>()
  const [captionText, setCaptionText] = useState<string>('')
  const [locationText, setLocationText] = useState<string>('')
  
  const hiddenFileInput = React.useRef<HTMLInputElement>(null)

  const { userInfos, isOpen, CloseModal } = props

  const Choose_File = (): void => {
    hiddenFileInput.current!.click()
  }

  const createFormData = (image: any, body: { [key: string]: string } = {}): FormData => {
    const data = new FormData();
  
    data.append('image', image);
  
    Object.keys(body).forEach((key: string) => {
      data.append(key, body[key]);
    });
  
    return data;
  }

  const File_Upload = (e: ChangeEvent): void => {
    const target= e.target as HTMLInputElement
    const file: File = (target.files as FileList)[0]
    setImageToUpload(file)
    const url: string = URL.createObjectURL(file)
    setPreviewImageUrl(url)
    setCurrentViewIndex(1)
    console.log(file)
    console.log(url)
  }

  const Submit_Post = (): void => {
    fetch(`${API_URI}/post/create`, {
      method: 'POST',
      body: createFormData(imageToUpload, {
        userId: userInfos._id,
        caption: captionText,
        location: locationText
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        window.location.hash = `profile/${userInfos._id}`
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  const CurrentModal = (props: {currentView: number, setCaptionText: (value: string) => void, setLocationText: (value: string) => void}) => {

    const { currentView, setCaptionText, setLocationText } = props

    switch (currentView) {
      case 0:
        return (
          <div className="modal post-modal">
            <div className="modal-header">
              <h1>Créer une nouvelle publication</h1>
            </div>
            <div className='modal-body flex-center'>
              <svg height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path><path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path></svg>
              <h2>Faites glisser les photos et les vidéos ici</h2>
              <button id='choose_file' onClick={Choose_File}>
                Sélectionner sur l'ordinateur 
                <input type='file' ref={hiddenFileInput} onChange={File_Upload} />
              </button>
            </div>
          </div>
        )
        break
        case 1:
          return (
            <div id='final_view' className="modal post-modal">
              <div className="modal-header">
                <svg className='modal-header-back_btn' viewBox="0 0 24 24"><path d="m22 11h-17.586l5.293-5.293a1 1 0 1 0 -1.414-1.414l-7 7a1 1 0 0 0 0 1.414l7 7a1 1 0 0 0 1.414-1.414l-5.293-5.293h17.586a1 1 0 0 0 0-2z"/></svg>
                <h1>Créer une nouvelle publication</h1>
                <button className='modal-header-next_btn' onClick={Submit_Post}>Partager</button>
              </div>
              <div className='modal-body flex-row'>
                {previewImageUrl && <img className='post-modal-image_preview' src={previewImageUrl} />}
                <div className='post-modal-infos'>
                  <div className='post-modal-infos-caption'>
                    <div className='post-modal-infos-user'>
                      <img src={userInfos.profilePicUrl} />
                      <span>{userInfos.username}</span>
                    </div>
                    <textarea value={captionText} placeholder='Écrivez une légende…' onChange={e => setCaptionText(e.target.value)}></textarea>
                  </div>
                  <div className='post-modal-infos-location'>
                    <input type='text' placeholder='Ajouter un lieu' value={locationText} onChange={e => setLocationText(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )
          break
      default:
        return (
          <div className="modal post-modal">
            <div className="modal-header">
              <h1>Créer une nouvelle publication</h1>
              <button className='modal-header-btn'>Suivant</button>
            </div>
            <div className='modal-body flex-center'>
              <svg height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path><path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path></svg>
              <h2>Faites glisser les photos et les vidéos ici</h2>
              <button id='choose_file' onClick={Choose_File}>
                Sélectionner sur l'ordinateur 
                <input type='file' ref={hiddenFileInput} />
              </button>
            </div>
          </div>
        )
        break
    }
  }
  
  return (
    <div className='fullpage-centered' style={{display: isOpen ? 'flex' : 'none'}}>
      <div className='fullpage-close' onClick={CloseModal}>
        <svg viewBox="0 0 311 311.07733" xmlns="http://www.w3.org/2000/svg"><path d="m16.035156 311.078125c-4.097656 0-8.195312-1.558594-11.308594-4.695313-6.25-6.25-6.25-16.382812 0-22.632812l279.0625-279.0625c6.25-6.25 16.382813-6.25 22.632813 0s6.25 16.382812 0 22.636719l-279.058594 279.058593c-3.136719 3.117188-7.234375 4.695313-11.328125 4.695313zm0 0" /><path d="m295.117188 311.078125c-4.097657 0-8.191407-1.558594-11.308594-4.695313l-279.082032-279.058593c-6.25-6.253907-6.25-16.386719 0-22.636719s16.382813-6.25 22.636719 0l279.058594 279.0625c6.25 6.25 6.25 16.382812 0 22.632812-3.136719 3.117188-7.230469 4.695313-11.304687 4.695313zm0 0" /></svg>
      </div>
      {/* <CurrentModal currentView={currentViewIndex} setCaptionText={setCaptionText} setLocationText={setLocationText} /> */}
      {
        currentViewIndex === 0
        ?
        <div className="modal post-modal">
          <div className="modal-header">
            <h1>Créer une nouvelle publication</h1>
          </div>
          <div className='modal-body flex-center'>
            <svg height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path><path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path></svg>
            <h2>Faites glisser les photos et les vidéos ici</h2>
            <button id='choose_file' onClick={Choose_File}>
              Sélectionner sur l'ordinateur 
              <input type='file' ref={hiddenFileInput} onChange={File_Upload} />
            </button>
          </div>
        </div>
        :
        <div id='final_view' className="modal post-modal">
          <div className="modal-header">
            <svg className='modal-header-back_btn' viewBox="0 0 24 24"><path d="m22 11h-17.586l5.293-5.293a1 1 0 1 0 -1.414-1.414l-7 7a1 1 0 0 0 0 1.414l7 7a1 1 0 0 0 1.414-1.414l-5.293-5.293h17.586a1 1 0 0 0 0-2z"/></svg>
            <h1>Créer une nouvelle publication</h1>
            <button className='modal-header-next_btn' onClick={Submit_Post}>Partager</button>
          </div>
          <div className='modal-body flex-row'>
            {previewImageUrl && <img className='post-modal-image_preview' src={previewImageUrl} />}
            <div className='post-modal-infos'>
              <div className='post-modal-infos-caption'>
                <div className='post-modal-infos-user'>
                  <img src={userInfos.profilePicUrl} />
                  <span>{userInfos.username}</span>
                </div>
                <textarea value={captionText} placeholder='Écrivez une légende…' onChange={e => setCaptionText(e.target.value)}></textarea>
              </div>
              <div className='post-modal-infos-location'>
                <input type='text' placeholder='Ajouter un lieu' value={locationText} onChange={e => setLocationText(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default CreatePostModal