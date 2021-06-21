import React from 'react';

class Profile extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            changePic: false,
            picture: '',
            extentionError: '',
            tooLargeError: '',
            emptyError: '',
            loading: false,
        }

        this.handelPic = this.handelPic.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handelUpload = this.handelUpload.bind(this)
       
    }

    handelPic(){
        this.setState({
            changePic: !this.state.changePic
        })
    }

    handleUpdate(event){

        this.setState({
           picture: event.target.files[0],
           extentionError: '',
           tooLargeError: '',
           emptyError: '',
        })


    }

    handelUpload(e){

        e.preventDefault()

        

        const data = new FormData();
        const imgFile = this.state.picture
        data.append('file', imgFile);

        let errors = 0
        let extention = "";
        let tooLarge = "";
        let empty = "";

        if (imgFile !== "" && !imgFile.name.toLowerCase().match(/.(jpg|jpeg|png)$/i)){
            
            extention = <p className="id-error">Thie image is not a jpg/jepg/png file.</p>;
            errors ++;
        }

        if(imgFile.size > 5000000){
            
              tooLarge = <p className="id-error">The image file can not be larger than 5MB.</p>  
                errors ++;
        }

        if(imgFile === ""){
            
            empty = <p className="id-error">No image file choosen.</p>  
            errors ++;
        }

        this.setState({
        
            extentionError: extention,
            tooLargeError: tooLarge,
            emptyError: empty,
            
        })


        if(errors === 0){

            this.setState({
                loading: true
            })

            const config = {
                headers: {
                    'userid': this.props.user.id,
                    'imgextention': imgFile.name.split(".").slice(-1)[0].toLowerCase(),
                    'content-type': 'multipart/form-data',
                    'username': this.props.user.username,
                    'verified': this.props.user.verified,
                    'otpauth_url': this.props.user.otpauth_url,
                    'original': this.props.user.img_url
                }
            };

              this.props.uploadPicture(data, config)
              .then(() => { 

                this.setState({
                    changePic: !this.state.changePic,
                    picture: '',
                    loading: false
                })           
              });
        }
    }

    render() {
        const {user} = this.props;
        if(this.state.loading){

            return (

                <div className="profile">
                    <div className="profilebody">
                        <h3 style={{"height": "250px", "paddingTop":"50%"}}>Picture is Loading...</h3>
                    </div>
                </div>
                
            )

        }else{

            return (
                <div className="profile">
                    <div className="profilebody">
                        <p>Hello, {user.username}!</p>
                        <p>ID: {user.id}</p>

                        {this.props.verified ? <p className="profile-2f-verified">Two Factor Authentication: Verified </p> : <p className="profile-2f-unverified">Two Factor Authentication: Unverifid </p>  }
                        
                        <img src={this.props.user.img_url? this.props.user.img_url : "default-user.png" } className="profile-pic" alt="profile"/>
                        
                        {this.state.extentionError}
                        {this.state.tooLargeError}
                        {this.state.emptyError}

                        <form onSubmit={this.handelUpload} className="uploadPic">

                        {this.state.changePic ?  <input type="file" onChange={this.handleUpdate}/> : <button onClick={this.handelPic}>Upload a profile picture</button>}
                        {this.state.changePic ? <button type="submit">Upload</button> : null}
                        
                        </form>

                        {this.state.changePic ? <button onClick={this.handelPic}>Cancel</button> : null}
                        
                    </div>
                </div>

            )
        }

              
    }
}

export default Profile;