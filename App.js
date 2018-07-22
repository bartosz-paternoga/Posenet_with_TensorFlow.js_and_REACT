import React, { Component } from 'react';
import Comp from './component1';
import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';

class App extends Component {



     startWebcam = () =>{

      
        navigator.getUserMedia (

          // constraints
                {
                   video: true,
                   audio: false
                },

          // successCallback
                function(a) {   
                const video = document.querySelector('video');

                video.srcObject = a; 

                },

          // errorCallback
                function() {}

        );

    } 


    main = async () => {

      this.startWebcam();

      var canvas = document.getElementById('my-canvas');
      var ctx = canvas.getContext('2d');
      var img = document.querySelector('video');

      canvas.setAttribute('width', `${img.width}`);
      canvas.setAttribute('height', `${img.height}`);

      var imageScaleFactor = 0.5;
      var outputStride = 16;
      var flipHorizontal = false;

      
      var model = await posenet.load();


      while (true) {

        let poses = [];


         const pose = await model.estimateSinglePose(img, imageScaleFactor, flipHorizontal, outputStride);


        const modelLoad = "LOADED";

        if (modelLoad !=="") {
          const elem1 = document.getElementById('loading-message');
          elem1.style.display = 'none';
          const elem2 = document.getElementById('sk-cube-grid');
          elem2.style.display = 'none';
        }


         poses.push(pose);

         ctx.drawImage(img, 0, 0, 640, 480);

          pose.keypoints.forEach(function(keypoint) {
              if (keypoint.score > 0.50) {

              ctx.beginPath();
              ctx.fillStyle = 'rgb(255, 255, 89)';
              ctx.fillText(keypoint.part, keypoint.position.x + 10, keypoint.position.y);
              ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, Math.PI * 2, false);
              ctx.fillStyle = 'rgb(255, 0, 0)';
              ctx.fill();

            //  console.log("/body part:", keypoint.part, "/score:", keypoint.score, 
              //  "/position.x:", keypoint.position.x, "/position.y:", keypoint.position.y);

                }
            });




      const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
            pose.keypoints, 0.1);

            adjacentKeyPoints.forEach((keypoints) => {
                  console.log(keypoints);
            });
          

      function toTuple({y, x}) {
              return [y, x];
            }


       function drawSkeleton(keypoints, minConfidence , ctx, scale = 1) {
          const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
                 keypoints, minConfidence);

                adjacentKeyPoints.forEach((keypoints) => {
                  drawSegment(toTuple(keypoints[0].position),
                  toTuple(keypoints[1].position), 'aqua', scale, ctx);
              });
            }  


       function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
            ctx.beginPath();
            ctx.moveTo(ax * scale, ay * scale);
            ctx.lineTo(bx * scale, by * scale);
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'aqua';
            ctx.stroke();
          }


        drawSkeleton(pose.keypoints, 0.5, ctx);


       await tf.nextFrame();

      }

    }
        


   render() {
        
        return (
                 <Comp
                 main0 = {this.main0}
                 main = {this.main}

                 
                 />
      
       );
    }

};


export default App;