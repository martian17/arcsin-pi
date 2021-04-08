<h1>Calculating pi from coin toss tally</h1>
<h2>Details</h2>
Tallying cummulate positive scores while you flip ccoins n times gives you the graph above.<br>
It it counterintuitive however why random coinflips will produce bippolar result<br>
It is because first few results will affect the later results, making the score stay on either the positive or the negative side.<br>
The probability dencity can be expressed by the following equation.<br>
p(t)=1/(π√(t(1-t)))<br>
Transforming this will give the following
π=1/(p(t)√(t(1-t)))<br>
Basically from here, all you need to do is plug in all the resulting values from the graph to this equation.<br>
<a target="_blank" href="https://mixedmoss.com/miscellaneous/randomwalk_arcsin_theory1.pdf">Inspiration</a><br>
<h2>Optimization</h2>
In a naive implementation, computationally heavy Math.random() function will be invoked upon calculating every random coin tosses,<br>
Here, notice that this is sequence of binary decision can be expressed by the same bites length of bit field.<br>
I exploited the fact that the second to the fifth byte of Math.random() floating point ooutput will give a perfect sequence of random bits.<br>
<ul>
<li>First I created a binary buffer using ```ArrayBuffer()```.<br>
<li>Second I initialized said ArrayBuffer with Float64Array, Uint8Array, and Int32Array view object<br>
<li>Third, I stored the result of Math.random into ArrayBuffer through the Float64Array.<br>
<li>Finally, I can swap out the good bits to desirable locations in the array buffer using Uint8Array.<br>
</ul>
This way, with a help of a loop, the entire ArrayBuffer can be filled with desired length of random bits.<br>
In order to take out a certain bit, we can divide the index by 32 to find the corresponding integer in Int32Array field, and perform some bitwize operations to extract the desired bit.<br>
The following is an implemented example of the stated algorithm<br>

```JavaScript
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
```