var randomBitList = function(n){
    var floats = Math.ceil(n/64)+1;
    var buff = new ArrayBuffer(floats*8);
    var floatView = new Float64Array(buff);
    var int8View = new Uint8Array(buff);
    var intView = new Int32Array(buff);
    for(var i = 0; i < (floats-1)*2; i++){
        floatView[floats-1] = Math.random();
        int8View[(floats-1)*8] = int8View[(floats-1)*8+4];
        intView[i] = intView[(floats-1)*2];
    }
    this.get = function(idx){
        var i = idx>>5;//divide by 32
        var j = idx%32;
        return (intView[i]>>j)&1;
        //return Math.random()>0.5?0:1;
    };
    this.getBitList = function(){
        var arr = [];
        for(var idx = 0; idx < n; idx++){
            var i = idx>>5;//divide by 32
            var j = idx%32;
            arr[idx] = (intView[i]>>j)&1;
        }
        return arr;
    }
};

/*//test code, produces a random image
var canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 500;
var width = 500;
var height = 500;
var wh = width*height;
var bl = new randomBitList(wh);
var ctx = canvas.getContext("2d");
var imgdata = ctx.getImageData(0,0,width,height);
var data = imgdata.data;
for(var i = 0; i < wh; i++){
    var idx = i*4;
    if(i < wh/2){
        var val = Math.random() > 0.5 ? 0 : 1;
        data[idx+0] = 255*val;
        data[idx+1] = 255*val;
        data[idx+2] = 255*val;
        data[idx+3] = 255;
    }else{
        data[idx+0] = 255*bl.get(i);
        data[idx+1] = 255*bl.get(i);
        data[idx+2] = 255*bl.get(i);
        data[idx+3] = 255;
    }
}
ctx.putImageData(imgdata,0,0);
*/


var initiate = function(canvas){
    var width = canvas.width;//needs to be odd
    var height = canvas.height;
    var ctx = canvas.getContext("2d");
    var elen = width;
    var tally = [];
    var cnt = 0;
    for(var i = 0; i < width+1; i++){
        tally[i] = 0;
    }
    this.tally = tally;
    
    this.executeWalk = function(){
        var bl = new randomBitList(elen);
        var positive = 0;
        var position = 0;
        for(var i = 0; i < elen; i++){
            var direction = bl.get(i)*2-1;
            position += direction;
            if(position > 0){
                positive++;
            }
        }
        tally[positive]++;
        cnt++;
    };
    
    this.draw = function(){
        ctx.clearRect(0,0,width,height);
        var imgdata = ctx.getImageData(0,0,width,height);
        var data = imgdata.data;
        var max = 0;
        for(var i = 1; i < width+1; i++){
            if(tally[i] > max)max = tally[i];
        }
        var tally1;
        if(max != 0){
            tally1 = [];
            for(var i = 1; i < width+1; i++){
                tally1[i] = tally[i]/max;
            }
        }else{
            tally1 = tally
        }
        for(var i = 0; i < width; i++){
            var h = Math.floor(tally1[i+1]*(height-1));
            for(var j = height-h; j < height; j++){
                var idx = (j*width+i)*4;
                data[idx+0] = 0;
                data[idx+1] = 0;
                data[idx+2] = 0;
                data[idx+3] = 255;
            }
        }
        ctx.putImageData(imgdata,0,0);
    };
    
    this.getMiddleProbensity = function(){
        var tlen = tally.length;
        var midval;
        if(tlen&1 === 1){//whole odd, so 
            var sum = 0;
            sum += tally[(tlen-1)/2-1];
            sum += tally[(tlen-1)/2];
            sum += tally[(tlen-1)/2+1];
            sum += tally[(tlen-1)/2+2];
            midval = sum/4;
        }else{
            var sum = 0;
            sum += tally[tlen/2-2];
            sum += tally[tlen/2-1];
            sum += tally[tlen/2];
            sum += tally[tlen/2+1];
            sum += tally[tlen/2+2];
            midval = sum/5;
        }
        return midval/cnt*tlen;
    };
    this.calculatePI = function(){
        var tlen = tally.length;
        var pisum = 0;
        var aa = 0;
        for(var i = 1+5; i < tlen-5; i++){
            var t = (i-0.5)/tlen;
            var p = tally[i]/cnt*tlen;
            var pi = 1/(p*Math.sqrt(t*(1-t)));
            pisum += pi;
            aa++;
        }
        return pisum/aa;
    }
};

var canvas = document.getElementById("canvas");
var width = ((window.innerWidth>>1)-1)*2+2;//ensures it's odd number
var height = 500;
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");

var sim = new initiate(canvas);

var animate = function(){
    for(var i = 0; i < 1000; i++){
        sim.executeWalk();
    }
    sim.draw();
    var pi = sim.calculatePI();
    ctx.font = "30px Serif";
    ctx.fillStyle = "#000";
    ctx.fillText("π="+pi,10,30);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

