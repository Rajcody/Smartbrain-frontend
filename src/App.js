
import './App.css';
import React,{Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '1110da5faf564d6d85476740012d56f3'
 });


const particlesOptions= {
  
    particles: {
      number: {
        value: 37,
        density:{
            enable: true,
            value_area:200
          }
      } 
    } ,    
        interactivity:{
            onhover: {
              enable: true,
              mode: 'repulse'
            }
        }    
} 
      
        
    

    
    

const initialState={
  input:'',
  imageUrl:'',
  box:{},
  route:'signin',
  isSignedIn: false,
  user:{
    email:'',
    id:'',
    name:'',
    entries:0,
    joined: ''
    

  }
}

class App extends Component {
  constructor(){
    super();
    this.state= initialState;
    }
  

  loadUser=(data)=>{
    this.setState({user:{
      
        id: data.id ,
        email: data.email,
        name: data.name,
        entries:data.entries,
        joined: data.joined

    }})
  }
  
   
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }



  displayFaceBox = (box) => {
    this.setState({box: box});
  }
  
  onRouteChange=(route)=>{
    if(route==='signout'){
      this.setState(initialState)
    }else if(route==='home') {
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }
  
  onInputchange=(event)=>{
   this.setState({input:event.target.value});
  }

  onButtonSubmit=()=>{
    this.setState({imageUrl: this.state.input});
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response=>{
      if(response){
        fetch('https://polar-forest-96324.herokuapp.com/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
        })
      })
        .then(response=>response.json())
        .then(count=>{
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        .catch(console.log)
    }
      this.displayFaceBox(this.calculateFaceLocation(response))
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      
    })
      .catch(err=> console.log('Picture Doesnot contain any faces',err));

      
     

  }

render(){
  return (
    <div className="App">
      <Particles  className='particles'
           params={particlesOptions}
              
      />
      <Navigation   isSignedIn={this.state.isSignedIn} onRoutechange={this.onRouteChange}/>
      { this.state.route==='home' 
        ?<div>
            <Logo/>
            <Rank 
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm 
              onInputchange={this.onInputchange}
              onButtonSubmit={this.onButtonSubmit}/>
        
            <FaceRecognition  box={this.state.box} imageUrl={this.state.imageUrl}/>

         </div>
         :(
           this.state.route=== 'signin'
               
            ?<SignIn   loadUser={this.loadUser}  onRouteChange={this.onRouteChange}/>
            :<Register loadUser={this.loadUser}  onRouteChange={this.onRouteChange}/>
         )
      }   
    </div>
  );

}
 
}

export default App;
