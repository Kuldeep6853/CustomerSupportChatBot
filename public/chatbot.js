
(function (){
    
    const api_Url="http://localhost:3000/api/chat";

    const scriptTag=document.currentScript;
    const ownerId=scriptTag.getAttribute("data-owner-id")

    if(!ownerId){
        console.log("ownerId is not found")
        return
    }

    const button=document.createElement("div")
    button.innerHTML="🗨️"
    Object.assign(button.style,{
        position:"fixed",
        bottom:"24px",
        right:"24px",
        width:"56px",
        height:"56px",
        borderRadius:"50%",
        background:"#000",
        color:"#fff",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        cursor:"pointer",
        fontSize:"22px",
        boxShadow:"0 15px 40px rgba(0,0,0,0.35)",
        zIndex:"999999"
    })
    document.body.appendChild(button)
    
    const box=document.createElement("div")
    Object.assign(box.style,{
        position:"fixed",
        bottom:"90px",
        right:"24px",
        width:"320px",
        height:"420px",
        borderRadius:"20px",
        background:"#fff",
        display:"none",
        flexDirection:"column",
        overflow:"hidden",
        fontFamily:"Inter,system-ui,sans-serif",
        boxShadow:"0 25px 60px rgba(0,0,0,0.25)",
        zIndex:"999999"
    })
     box.innerHTML=`<div style="
       background:#000;
       color:#fff;
       padding:12px 24px;
       font-size:14px;
       display:flex;
       justify-content:space-between;
       align-items:center;
       ">
       <span>Customer Support</span>
       <span id="chat-close" style="cursor:pointer; font-size:16px">✕</span>
       </div>

       <div id="chat-messages" style="
       flex:1;
       padding:12px;
       overflow-y:auto;
       background:#f9fafb;
       display:flex;
       flex-direction:column;
       "></div>
       

       <div style="
        display:flex;
        border-top:1px solid #e5e7eb;
        padding:8px;
        gap:6px;
       ">

        <input type="text" placeholder="Type a message..." id="chat-input" style="
        flex:1;
        width:100%;
        padding:8px 10px;
        border:1px solid #d1d5db;
        border-radius:8px;
        outline:none;
        font-size:14px;
        box-sizing:border-box;
        "/>
        <button id="chat-send" style="
        right:24px;
        bottom:24px;
        width:32px;
        height:32px;
        border-radius:50%;
        background:#000;
        color:#fff;
        border:none;
        cursor:pointer;
        font-size:16px;
        align-items:center;
        justify-content:center;
         ">➤</button>
       </div>
       `

       document.body.appendChild(box)

       button.onclick=()=>{
        box.style.display=box.style.display==="none"?"flex":"none";
       }

       document.querySelector("#chat-close").onclick=()=>{
         box.style.display="none"
       }

       const input=document.querySelector("#chat-input")
       const sendBt=document.querySelector("#chat-send")
       const messageArea=document.querySelector("#chat-messages")

       function appendMessage(text, from){
        const message=document.createElement("div")
        message.innerHTML=text;
        Object.assign(message.style,{
            maxWidth:"78%",
            padding:"8px 12px",
            borderRadius:"14px",
            fontSize:"13px",
            lineHeight:"1.4",
            marginBottom:"8px",
            alignSelf:from==="user"?"flex-end":"flex-start",
            backgroundColor:from==="user"?"#000":"#e5e7eb",
            color:from==="user"?"#fff":"#111",

            borderTopRadius:from==="user"?"4px":"14px",
            borderTopLeftRadius:from==="user"?"14px":"4px",
        })

        messageArea.appendChild(message)
        messageArea.scrollTop=messageArea.scrollHeight;

       }

       sendBt.onclick=async()=>{
        const text=input.value.trim();
        if(!text){
            return
        }
        appendMessage(text,"user");
        input.value=""
        
        const typing=document.createElement("div")
        typing.innerHTML="Typing..."
        typing.style.cssText=`padding:8px 12px; background:#e5e7eb; border-radius:14px; font-size:13px; margin-bottom:8px; align-self:flex-start;`
        messageArea.appendChild(typing)
        messageArea.scrollTop=messageArea.scrollHeight;


        try {
        const response=await fetch(api_Url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ownerId,message:text})
        })

        const data=await response.json();
        messageArea.removeChild(typing)
        appendMessage(data.reply || "something went wrong","bot")
       } catch (error) {
        messageArea.removeChild(typing)
        appendMessage("Error processing your request.","bot")
       }
       }

       



})() 