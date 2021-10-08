export default {
    Comment:{
        isMe:({userId},_,{loggedInUser})=> loggedInUser?loggedInUser===userId:false
        
    }    
}