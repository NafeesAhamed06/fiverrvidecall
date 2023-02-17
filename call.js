let localVideo = document.getElementById("local-video")
let remoteVideo = document.getElementById("remote-video")
let cambutton = document.getElementById("toggle-cam")
let micbutton = document.getElementById("toggle-mic")
let endbutton = document.getElementById("toggle-end")
let buttoncontrols = document.getElementById("butcontrols")

const peers = {}

buttoncontrols.hidden = true
cambutton.hidden = true
micbutton.hidden = true
endbutton.hidden = true

localVideo.style.opacity = 0
remoteVideo.style.opacity = 0

localVideo.onplaying = () => { localVideo.style.opacity = 1 }
remoteVideo.onplaying = () => { remoteVideo.style.opacity = 1 }

let otherUserId
let peer
function init(userId) {
    peer = new Peer(userId)
    // , {
    //     host: '',
    //     port: ''
    //     path: '/myapp'
    // })

      
    listen()

    localVideo.muted = true;
    
    let localStream
    function listen() {
        peer.on('call', (call) => {
            
            const answerCall =  confirm(`Incoming Call, Do you want to answer?`);
            if (answerCall){
                
                call.on('close', function(){

                    window.location.reload()
                })

                buttoncontrols.hidden = false
                cambutton.hidden = false
                micbutton.hidden = false
                endbutton.hidden = false
                
                navigator.getUserMedia({
                    audio: true, 
                    video: true
                }, (stream) => {
                    
                    localVideo.srcObject = stream
                    localStream = stream
                    
                    call.answer(stream)
                    call.on('stream', (remoteStream) => {
                remoteVideo.srcObject = remoteStream

                remoteVideo.className = "primary-video"
                localVideo.className = "secondary-video"
                
                call.on('close', function(){
                    alert("call ended")
                    window.location.reload()
                })

            })
            
        })}
        else{
            peer.disconnect();
            alert('call decline!');
        }
})
}

}

function startCall(otherUserId) {
    navigator.getUserMedia({
        audio: true,
        video: true
    }, (stream) => {

        buttoncontrols.hidden = false
        cambutton.hidden = false
        micbutton.hidden = false
        endbutton.hidden = false
        
        localVideo.srcObject = stream
        localStream = stream
        
        myTimeout = setTimeout(() => { window.location.reload }, 10000);
        
        var conn = peer.connect(otherUserId);
        conn.on('close', function() {
            alert("call ended")
            window.location.reload()
        })


        const call = peer.call(otherUserId, stream)
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream
            
            remoteVideo.className = "primary-video"
            localVideo.className = "secondary-video"
            clearTimeout(myTimeout);  

            var conn = peer.connect(otherUserId);
            conn.on('close', function() {
            window.location.reload()
        })
        })
     
    })
}

function closeCall(){
    peer.destroy();
    window.location.reload();
}

function changeltor(){
    remoteVideo.className = "secondary-video"
    localVideo.className = "primary-video"
}
function changertol(){
    localVideo.className = "secondary-video"
    remoteVideo.className = "primary-video"
}
function notanswered() {
    alert("call,not answered")
    window.location.reload()
    
}

cambutton.addEventListener('click', () => {
    const videoTrack = localStream.getTracks().find(track => track.kind === 'video');
    if (videoTrack.enabled) {
        videoTrack.enabled = false;
        document.getElementById("cambutimg").src = "./img/video-camera-off.png"
    }else{
            videoTrack.enabled = true;
            document.getElementById("cambutimg").src = "./img/video-camera-on.png"
    }
    
})

micbutton.addEventListener('click', () => {
    const audioTrack = localStream.getTracks().find(track => track.kind === 'audio');
    if (audioTrack.enabled) {
        audioTrack.enabled = false;
        document.getElementById("micbutimg").src = "./img/mic-off.png"
    }else{
            audioTrack.enabled = true;
            document.getElementById("micbutimg").src = "./img/mic-on.png"
    }
    
})


