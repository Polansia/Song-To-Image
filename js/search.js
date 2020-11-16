$(function() {

  let artist = $("#artist"),
      title = $("#title"),
      images = $("#images"),
      limit = $("#limit"),
      lyricId = 0;
      var index = 0; 
      

      $("#songId").submit((e) => {
                
        document.getElementById("lyricSearch").style.display = "none";
        
        e.preventDefault();
        e.stopPropagation();
        artistValue = artist.val()
        titleValue = title.val()
        limitValue = limit.val()
               
        images.empty();
        index = 0;       
        songSearch()   
      });     
      
      function songSearch(){
           
        $.ajax({
          method: 'GET', 
          url: "https://api.lyrics.ovh/v1/" + artistValue + "/" + titleValue,
          success: function (data){
          lyrics = data.lyrics //fetches the lyrics
          lyrics = lyrics.replace(/(\r\n|\n|\r)/gm, " ") //Removes any <br> that the lyrics.ovh api might create
          lyricArray = lyrics.split(' ') //splits the lyrics for every word 

          

          timer()
          if (lyrics === ""){ // If results are empty due to API limitations, instruct user to try again soon

            alert("Too many requests, please try again in a couple minutes.")
            window.location.reload();

          }
          else{ //Creates a 'generating' status when lyrics are properly found
            let generate = $( ".generation" )
            let lyrics = $( ".lyricButton" )

            var generating = document.createElement("div")
            generating.innerHTML = "Generating..."
            generating.className ="generate"
            
            var loader = document.createElement("div")  
            loader.className ="loader"

            var lyricsButton = document.createElement("button")  //creates lyrics button
            lyricsButton.innerHTML="Lyrics!"
            lyricsButton.onclick= function lyricFunction(){ 

             window.open("https://api.lyrics.ovh/v1/" + artistValue + "/" + titleValue, '_blank');
            }

            lyrics.append(lyricsButton)
            generate.append(generating)
            generate.append(loader)

          }
          },
          error:function(error){

            alert("Incorrect Artist or SongName")
            window.location.reload();

          }
        });

      
        function timer() {             
          setTimeout(function() {            
            lyricId = lyricArray[index] 
            
            imageGet();   
            index++    
            if (limitValue > 1){
              arrayLimit = limitValue            
            }           
            else {             
              arrayLimit = lyricArray.length            
            }
            if (index < arrayLimit) {                   
              timer();           
            }           
            else{             
              document.getElementById("lyricSearch").style.display = "";
            }           
          }, 800) //slows our image calls due to an existing rate limit
        }     
      }
      function imageGet(){
        const apiKey = '563492ad6f9170000100000183226db7a2fe4a44a8e0e93d40c4f7b7';
        
        $.ajax({
          method: 'GET',
          "timeout": 5000,
          beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", apiKey);
          },
          url: "https://api.pexels.com/v1/search?query=" + lyricId + "&per_page=25",
          success: function (data){           
            console.log(data)
            
            totalResults = data.total_results
            photosLength = data.photos.length
            function randomNumber() {
              x = Math.floor((Math.random() * totalResults) + 1);;              
              photoIndex = (x - 1)
            if (photoIndex >= 25){
                photoIndex = 24 //to prevent overflow 
              }    
            //selects a random number to gets an image from the coreesponding index
           }      
           randomNumber() 
            if (photosLength === 0){
              createWord()
            } 
            else{
            authorSource = data.photos[photoIndex].photographer_url
            source = data.photos[photoIndex].src.tiny
            createImage()
            }
          },
          error:function(err){
            
            console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            
          }
        });
      }
      function createImage() { 
        var link = document.createElement('a');
        var img = document.createElement('img'); 
        link.id = lyricId
        img.src = source
        img.className = "animate__animated animate__tada" //Provides an animation for elements coming in from the Animate.css framework
        link.href = authorSource
        link.appendChild(img)
        link.target = "_blank"
        images.append(link) //adds link to Pexel user pages
        
//Creates images and necessary attributes and adds them to the page
    }  
      function createWord(){ //Creates words among the images if there are no results in the database

        var wrd = document.createElement('canvas');
        var ctx = wrd.getContext("2d");
        ctx.textBaseline = 'middle'; 
        ctx.textAlign = 'center'; 
        ctx.font = "30px Arial";
        ctx.fillText('' + lyricId + '', wrd.width/2, wrd.height/2); 
        wrd.className = "animate__animated animate__tada"
        images.append(wrd)

      }
    
});     
