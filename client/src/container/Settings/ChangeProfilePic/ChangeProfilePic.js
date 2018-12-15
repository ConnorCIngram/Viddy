import React, { Component } from 'react';
import UserFromToken from '../../Utils/UserFromToken';
import changeProfilePic from '../../Utils/ChangeProfilePic';
import CloudUpload from '@material-ui/icons/CloudUpload';
import deleteProfilePic from '../../Utils/DeleteProfilePic';

require('./ChangeProfilePic.scss');

class ChangeProfilePic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      loading: false,
      error: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  handleDelete(e) {
    e.preventDefault();
    this.setState({loading: true});
    let confirm = window.confirm("Are you sure you want to remove your profile picture?");
    if (confirm) {
      deleteProfilePic(this.props.token)
        .then(res => {
          console.log(res.status, "Done!")
          this.setState({loading: false});
        })
        .catch(err => {
          console.log(err.message);
          this.setState({loading: false, error: err.message});
        });
    } else this.setState({loading: false});
  }
  handleChange(e) {
    e.preventDefault();
    let file = this.refs.file.files[0];
    if (file) {
      let reader = new FileReader();
      let url = reader.readAsDataURL(file);

      reader.onloadend = function (e) {
          this.setState({
              image: reader.result
          })
        }.bind(this);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.loading) {
      

      let interval;
      this.setState({loading: true}, () => {
        let i = 0;
        interval = setInterval(() => {
          this.refs.submitInput.value = "Uploading" + '.'.repeat(i);
          i = i === 3 ? 0 : i + 1;
        }, 300);
      });

      if (!this.state.image) {
        this.setState({loading: false, image: null}, () => {

        });
      }

      changeProfilePic(this.state.image, this.props.token)
        .then(res => {
          this.setState({loading: false, profilePicURL: res.data.profilePicURL, image: null}, () => {
            clearInterval(interval);
            this.refs.submitInput.value = "Upload Successful!";
            setTimeout(() => {
              this.refs.submitInput.value = 'Upload';
              this.refs.inputLabelVal.innerHTML = "Choose a file...";
            }, 5000);
          });
        })
        .catch(err => this.setState({loading: false, image: null}, () => {
          console.log(err);
          clearInterval(interval);
          this.refs.submitInput.value = "Error uploading photo";
          setTimeout(() => {
            this.refs.submitInput.value = "Save";
          }, 5000);
        }));
      }
  }
  componentWillReceiveProps(nextProps) {
    console.log('RECEIVING PROPS')
    if (nextProps.token) {
      UserFromToken(nextProps.token)
        .then(res => res.data)
        .then(user => this.setState({profilePicURL: user.profilePicURL}))
        .catch(err => console.log(err));
    } 
  }
  componentDidMount() {
    let labelVal = document.getElementById('labelVal');
    document.getElementById('file').addEventListener('change', function(e) {
      if (this.files && this.files.length === 1) {
        labelVal.innerHTML = this.files[0].name;
      }
    });

    if (this.props.token) {
      UserFromToken(this.props.token)
        .then(res => res.data)
        .then(user => this.setState({profilePicURL: user.profilePicURL}))
        .catch(err => console.log(err));
    } 
  }
  render() {
    return (
      <div className='ChangeProfilePic'>
        <div className='ContainerHeader'>
          <h4>Profile Picture</h4>
        </div>
        <div className='Container'>
            <div className="ProfilePicThumbnail">
              <div className="ProfilePicContainer">
                {this.state.profilePicURL
                && <img alt="Profile" src={this.state.profilePicURL} width='100px' id='profilePicThumbnail'/>
                }
              </div>
              <div className="ProfilePicHover" onClick={this.handleDelete}>
                change
              </div>
            </div>
          <div className="Form">
              <form id='form' method='POST' encType="multipart/form-data" onSubmit={this.handleSubmit}>
                  <input id='file' ref='file' type='file' name='image' accept='.jpg,.png' onChange={this.handleChange}/>
                  <label id='fileInput' htmlFor='file'>
                    <div id='left'>
                      <CloudUpload />
                    </div>
                    <div id='labelVal' ref='inputLabelVal'>
                      Choose a file ...
                    </div>
                  </label>
                <br/>
                <input type='submit' value='Upload' ref='submitInput' />
              </form>
          </div>
          <div className='Error'>
            {this.state.error}
          </div>
        </div>
      </div>
    );
  }
}

export default ChangeProfilePic;
