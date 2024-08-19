
let frame = document.getElementById('frame');
// let textArea = document.getElementById('textArea');
let stamp = document.getElementById('stamp');
let textContent = document.getElementById('textContent');
// let messageInput = document.getElementById('messageInput');
//define lines
let lineGroup = document.getElementById('lines');
let lineControls = document.getElementById('lineControls');
let linePath;
let lineX1='#lineX1';
let lineX2='#line0X2';
let lineY1='#line0Y1';
let lineY2='#line0Y2';
let linePointsPerLine='#line0Points';
let lineNoise='#line0Noise';
let lineSmooth='#line0Smooth';

//wavyPath Funcition
function createWavyPath(x, y, width, height, pointsPerSide, noiseAmount) {
    let points = [];
    let sides = [
        {start: [x, y], end: [x + width, y]},
        {start: [x + width, y], end: [x + width, y + height]},
        {start: [x + width, y + height], end: [x, y + height]},
        {start: [x, y + height], end: [x, y]}
    ];

    sides.forEach(side => {
        let [startX, startY] = side.start;
        let [endX, endY] = side.end;
        for (let i = 0; i <= pointsPerSide; i++) {
            let t = i / pointsPerSide;
            let pointX = startX + (endX - startX) * t;
            let pointY = startY + (endY - startY) * t;
            let noise = (Math.random() - 0.5) * noiseAmount;
            points.push([pointX + noise, pointY + noise]);
        }
    });

    return points;
}
function pointsToPath(points, closed = false, smooth = false) {
    if (smooth) {
        return smoothCurve(points, closed);
    } else {
        let commands = points.map((point, i) => 
            (i === 0 ? 'M' : 'L') + point[0] + ',' + point[1]
        );
        if (closed) commands.push('Z');
        return commands.join('');
    }
}

function createWavyLine(x, y, width, height, pointsPerSide, noiseAmount) {
    let points = [];
    let sides = [
        {start: [x, y], end: [x + width, y]},
        // {start: [x, y+ height], end: [x + width, y + height]},
        // {start: [x, y+ (height*2) ], end: [x + width, y + height*2]}
    ];

    sides.forEach(side => {
        let [startX, startY] = side.start;
        let [endX, endY] = side.end;
        for (let i = 0; i <= pointsPerSide; i++) {
            let t = i / pointsPerSide;
            let pointX = startX + (endX - startX) * t;
            let pointY = startY + (endY - startY) * t;
            let noise = (Math.random() - 0.5) * noiseAmount;
            points.push([pointX + noise, pointY + noise]);
        }
    });

    return points;
}

function pointsToLines(points, open, smooth = false) {
    if (smooth) {
        return smoothCurveLine(points, open);
    } else {
        let commands = points.map((point, i) => 
            (i === 0 ? 'M' : 'L') + point[0] + ',' + point[1]
        );
        if (closed) commands.push('Z');
        return commands.join(' ');
    }
}

function smoothCurve(points, closed) {
    let len = points.length;
    let path = `M${points[0][0]},${points[0][1]}`;
    
    for (let i = 0; i < len - 1; i++) {
        let p0 = points[(i - 1 + len) % len];
        let p1 = points[i];
        let p2 = points[(i + 1) % len];
        let p3 = points[(i + 2) % len];
        
        let cp1x = p1[0] + (p2[0] - p0[0]) / 6;
        let cp1y = p1[1] + (p2[1] - p0[1]) / 6;
        let cp2x = p2[0] - (p3[0] - p1[0]) / 6;
        let cp2y = p2[1] - (p3[1] - p1[1]) / 6;
        
        path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
    }
    
    if (closed) {
        let p0 = points[len - 2];
        let p1 = points[len - 1];
        let p2 = points[0];
        let p3 = points[1];
        
        let cp1x = p1[0] + (p2[0] - p0[0]) / 6;
        let cp1y = p1[1] + (p2[1] - p0[1]) / 6;
        let cp2x = p2[0] - (p3[0] - p1[0]) / 6;
        let cp2y = p2[1] - (p3[1] - p1[1]) / 6;
        
        path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}Z`;
    }
    
    return path;
}
function smoothCurveLine(points, open) {
    let len = points.length;
    let path = `M${points[0][0]},${points[0][1]}`;
    
    for (let i = 0; i < len - 1; i++) {
        let p0 = points[(i - 1 + len) % len];
        let p1 = points[i];
        let p2 = points[(i + 1) % len];
        let p3 = points[(i + 2) % len];
        
        let cp1x = p1[0] + (p2[0] - p0[0]) / 6;
        let cp1y = p1[1] + (p2[1] - p0[1]) / 6;
        let cp2x = p2[0] - (p3[0] - p1[0]) / 6;
        let cp2y = p2[1] - (p3[1] - p1[1]) / 6;
        
        path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
    }
    
    if (closed) {
        let p0 = points[len - 2];
        let p1 = points[len - 1];
        let p2 = points[0];
        let p3 = points[1];
        
        let cp1x = p1[0] + (p2[0] - p0[0]) / 6;
        let cp1y = p1[1] + (p2[1] - p0[1]) / 6;
        let cp2x = p2[0] - (p3[0] - p1[0]) / 6;
        let cp2y = p2[1] - (p3[1] - p1[1]) / 6;
        
        path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}Z`;
    }
    
    return path;
}

function updatePostcard() {
    // Frame
    let frameX = parseInt(document.getElementById('frameX').value);
    let frameY = parseInt(document.getElementById('frameY').value);
    let frameWidth = parseInt(document.getElementById('frameWidth').value);
    let frameHeight = parseInt(document.getElementById('frameHeight').value);
    let framePointsPerSide = parseInt(document.getElementById('framePointsPerSide').value);
    let frameNoiseAmount = parseInt(document.getElementById('frameNoiseAmount').value);
    let frameDashAmount = parseInt(document.getElementById('frameDashAmount').value);
    let frameStrokeAmount = parseInt(document.getElementById('frameStrokeAmount').value);
    let frameSmoothCurve = document.getElementById('frameSmoothCurve').checked;
    // frameNoiseAmount= frameNoiseAmount+10;
    
    let framePoints = createWavyPath(frameX, frameY, frameWidth, frameHeight, framePointsPerSide, frameNoiseAmount);
    frame.setAttribute('d', pointsToPath(framePoints, true, frameSmoothCurve));
    frame.setAttribute('stroke-dasharray', frameDashAmount);
    frame.setAttribute('stroke-width', frameStrokeAmount);
  

    // Stamp
    let stampX = parseInt(document.getElementById('stampX').value);
    let stampY = parseInt(document.getElementById('stampY').value);
    let stampSize = parseInt(document.getElementById('stampSize').value);
    let stampPointsPerSide = parseInt(document.getElementById('stampPointsPerSide').value);
    let stampNoiseAmount = parseInt(document.getElementById('stampNoiseAmount').value);
    let stampDashAmount = parseInt(document.getElementById('stampDashAmount').value);
    let stampStrokeAmount = parseInt(document.getElementById('stampStrokeAmount').value);
    let stampSmoothCurve = document.getElementById('stampSmoothCurve').checked;
    // stampNoiseAmount= stampNoiseAmount+10;
    let stampPoints = createWavyPath(stampX, stampY, stampSize, stampSize, stampPointsPerSide, stampNoiseAmount);
    stamp.setAttribute('d', pointsToPath(stampPoints, true, stampSmoothCurve));
    stamp.setAttribute('stroke-dasharray', stampDashAmount);
  stamp.setAttribute('stroke-width', stampStrokeAmount);


    // Lines
    let linesX = parseInt(document.getElementById('linesX').value);
    let linesY = parseInt(document.getElementById('linesY').value);
    // let linesSize = parseInt(document.getElementById('linesSize').value);
    let linesWidth = parseInt(document.getElementById('linesWidth').value);
    let linesHeight = parseInt(document.getElementById('linesHeight').value);
    let linesPointsPerSide = parseInt(document.getElementById('linesPointsPerSide').value);
    let linesNoiseAmount = parseInt(document.getElementById('linesNoiseAmount').value);
    let linesDashAmount = parseInt(document.getElementById('linesDashAmount').value);
    let linesStrokeAmount = parseInt(document.getElementById('linesStrokeAmount').value);
    let linesSmoothCurve = document.getElementById('linesSmoothCurve').checked;

    let linesPoints = createWavyLine(linesX, linesY, linesWidth, linesHeight, linesPointsPerSide, linesNoiseAmount);
//  linesNoiseAmount= linesNoiseAmount+10;
    lines.setAttribute('d', pointsToLines(linesPoints, true, linesSmoothCurve));
    lines.setAttribute('stroke-dasharray', linesDashAmount);
    lines.setAttribute('stroke-width', linesStrokeAmount);

// //values for every parameter at once
// // let advancedControls = document.getElementById('advancedControls').checked;
// // if(parseInt(document.getElementById('strokeAmount').value>0){
//     let strokeAmount = parseInt(document.getElementById('strokeAmount').value);
//     let noiseAmount =  parseInt(document.getElementById('noiseAmount').value);
//     let dashAmount = parseInt(document.getElementById('dashAmount').value);
//     linesStrokeAmount , stampStrokeAmount , frameStrokeAmount  = strokeAmount;
//     linesNoiseAmount , stampNoiseAmount ,frameNoiseAmount  = noiseAmount;
//     linesDashAmount , stampDashAmount , frameDashAmount  = dashAmount;

 
    

}

// Add event listeners to all input elements
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updatePostcard);
});


// Add code inside the function or remove the function if not needed
// function saveAsPng() {
//     let svg = document.querySelector('svg');
//     let svgData = new XMLSerializer().serializeToString(svg);
//     let canvas = document.createElement('canvas');
//     let ctx = canvas.getContext('2d');
//     let img = new Image();

//     let frameWidth = 2970;
//     let frameHeight = 4200;
//     // canvas.width = frameWidth;
//     // canvas.height = frameHeight;
//     let postcardWidth =frameWidth/2;
//     let postcardHeight =frameHeight/4;
  
//     // Set the canvas dimensions to match the frame size
//    canvas.width = postcardWidth*2;
//    canvas.height = postcardHeight*4;

//    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  
//     img.onload = function () {
//         for (i=0; i<2; i++){
//             for(j=0; j<4; j++){
               
              
//                 let linesNoiseAmount = parseInt(document.getElementById('linesNoiseAmount').value) + Math.random();
    
//                 // Update noise amounts
            
//                 document.getElementById('linesNoiseAmount').value = linesNoiseAmount;
    
          
//                 updatePostcard(); 
        
//                 ctx.drawImage(img, postcardWidth*i, postcardHeight*j, postcardWidth, postcardHeight);
              
//             }
           
//         }
  
//         let link = document.createElement('a');
//         link.download = 'postcard.png';
//         link.href = canvas.toDataURL('image/png');
//         link.click();
//     };

    
   
// }

function saveAsPng() {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    let frameWidth = 2970;
    let frameHeight = 4200;
    let postcardWidth = frameWidth / 2;
    let postcardHeight = frameHeight / 4;

    // Set the canvas dimensions to match the frame size
    canvas.width = postcardWidth * 2;
    canvas.height = postcardHeight * 4;

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) {
            // Increment or randomize noise amount for each postcard
            let frameNoiseAmount = parseInt(document.getElementById('frameNoiseAmount').value) + Math.random();
            let stampNoiseAmount = parseInt(document.getElementById('stampNoiseAmount').value) + Math.random();
            let linesNoiseAmount = parseInt(document.getElementById('linesNoiseAmount').value) + Math.random();

            // Update noise amounts
            document.getElementById('frameNoiseAmount').value = frameNoiseAmount;
            document.getElementById('stampNoiseAmount').value = stampNoiseAmount;
            document.getElementById('linesNoiseAmount').value = linesNoiseAmount;

            // Update the postcard SVG with the new noise values
            updatePostcard();

            // Get the updated SVG data
            let svg = document.querySelector('svg');
            let svgData = new XMLSerializer().serializeToString(svg);

            // Convert the SVG to an image
            let img = new Image();
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);

            img.onload = function() {
                // Draw the updated postcard on the canvas
                ctx.drawImage(img, postcardWidth * i, postcardHeight * j, postcardWidth, postcardHeight);

                // After all images are drawn, save the canvas as an image
                if (i === 1 && j === 3) {
                    let link = document.createElement('a');
                    link.download = 'postcardA4grid.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }
            };
        }
    }
}
function saveAsImage() {

    var svg = document.getElementById('postcard');
    let svgData = new XMLSerializer().serializeToString(svg);
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let img = new Image();


var serializer = new XMLSerializer();
var svgString = serializer.serializeToString(svg);

var link = document.createElement('a');
link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
link.download = 'postcard.svg';
link.click();

}
// function saveAsPng() {
//     let svg = document.querySelector('svg');
//     let svgData = new XMLSerializer().serializeToString(svg);
//     let canvas = document.createElement('canvas');
//     let ctx = canvas.getContext('2d');
//     let img = new Image();

//     let frameWidth = 900;
// let frameHeight = 600;

//     // Set the canvas dimensions to match the frame size
//     canvas.width = frameWidth;
//     canvas.height = frameHeight;

//     img.onload = function () {
//     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//     let link = document.createElement('a');
//     link.download = 'postcard.png';
//     link.href = canvas.toDataURL('image/png');
//     link.click();
//     };

//     img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
// }

// Initial setup
updatePostcard();
// saveAsImage();