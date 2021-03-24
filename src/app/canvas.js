class Sun{
    constructor(color, minRadius, maxRadius, minX, maxX, minY,  maxY, rMargin){
        this.color = color;
        this.r = Math.random()*(maxRadius - minRadius) + minRadius;
        let margin = this.r*rMargin;
        this.x = Math.random()*(maxX - minX - margin*2.0) + minX + margin;
        this.y = Math.random()*(maxY - minY - margin*2.0) + minY + margin;

    }

    draw(svg){
        svg.append("circle")
            .attr('cx', this.x)
            .attr('cy', this.y)
            .attr('r', this.r)
            .style('fill', this.color);
    }
}

class MountainRange{
    constructor(color, width, xMargin, baseY, minDeltaY, maxDeltaY, lateralVariation, minPoints, maxPoints, minSubdiv, maxSubdiv){
        this.color = color;
        this.width = width;
        this.xMargin = xMargin;
        this.baseY = baseY;
        this.minDeltaY = minDeltaY;
        this.maxDeltaY = maxDeltaY;
        this.lateralVariation = lateralVariation;
        this.verticalVariation = lateralVariation*1.5;
        this.minPoints = minPoints;
        this.maxPoints = maxPoints;
        this.dp = maxPoints - minPoints;
        this.n = Math.ceil(Math.random() * this.dp) + minPoints + 2;
        this.minSubdiv = minSubdiv;
        this.maxSubdiv = maxSubdiv;

        this.buildRange();


    }

    draw(svg, height){

        let path = new d3.path();
        path.moveTo(this.points[0].x, this.points[0].y);
        for(let i = 1; i < this.points.length; i++){
            path.lineTo(this.points[i].x, this.points[i].y);
        }
        path.lineTo(this.width, height);
        path.lineTo(0, height);
        path.closePath();

        svg.append("path")
            .attr("d", path)
            .attr("fill", this.color);

    }

    buildRange(){

        let points = [];
        let sign = Math.sign(Math.random()-0.5);
        
        for(let i = 0; i<this.n;i++){
            let dx = (this.width + (this.xMargin*2))/(this.n-1);
            let dlv = dx * (Math.random()-0.5) * 2 * this.lateralVariation;
            let x = (i === 0 || i === (this.n-1)) ? (dx*i) : (dx*i) + dlv;
            x -= this.xMargin;
            let dy = this.maxDeltaY - this.minDeltaY;
            let y = sign*(Math.random()*dy + this.minDeltaY) + this.baseY ;
            sign*=-1;
            points.push({x:x,y:y});
        }


        this.points = [];
        this.points.push(points[0]);
        for(let i = 1; i < points.length; i++){

            let dn = this.maxSubdiv - this.minSubdiv;
            let n = Math.floor(Math.random()*dn) + this.minSubdiv;
            
            for(let j = 0; j < n ; j++){

                let width = points[i].x - points[i-1].x;
                let dx = width/(n+1);
                let dlv = dx * (Math.random()-0.5) * 2 * this.lateralVariation;
                let x = (dx*(j+1)) + dlv + points[i-1].x;

                let height = points[i].y - points[i-1].y;
                let dy = height/(n+1);
                let dvv = dy * (Math.random()-0.5) * 2 * this.verticalVariation;
                let y = (dy*(j+1)) + dvv + points[i-1].y;
                
                this.points.push({x:x,y:y});
                
            }

            this.points.push(points[i]);
        }

    }
}


class Canvas{

    constructor(){

        //canvas config
        this.width = 400;
        this.height = 600;
        //this.colors = ["#ede6d6", "#f9c792", "#85aeaa", "#388199", "#323232"]
        this.colors = generateRandomColors();
        //this.colors = generateOGColors();

        //sun config
        this.radius = [80, 130];
        this.sunAllowable = 0.6;

        //mountains config
        this.ys = [300, 375, 500];
        this.minDeltaYs = [50,20,20];
        this.maxDeltaYs = [120,40,50];
        this.xMargin = 80;
        this.latVar = [0.5, 0.3, 0.3];
        this.nPoints = [[1, 1],[3, 3],[4, 4]];
        this.nSubdiv = [[3, 4],[2, 2],[1, 2]];


        //initialize pieces
        this.sun = new Sun(
            this.colors[1], 
            this.radius[0], 
            this.radius[1], 
            0, 
            this.width, 
            0, 
            (this.height*this.sunAllowable),
            0.3
        );

        this.mountains = [];
        for(let i = 0; i < 3; i++){
            this.mountains.push(new MountainRange(
                this.colors[i+2], 
                this.width, 
                this.xMargin,
                this.ys[i], 
                this.minDeltaYs[i],
                this.maxDeltaYs[i],
                this.latVar[i],
                this.nPoints[i][0], 
                this.nPoints[i][1], 
                this.nSubdiv[i][0], 
                this.nSubdiv[i][1]
            ));
        }

        //init d3
        this.svg = d3.select("#canvas")
            .append("svg")
            .attr("viewBox", [0, 0, this.width, this.height]);

    }

    draw(){
        this.svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", this.colors[0]);

        this.sun.draw(this.svg);
        for(let i = 0; i < this.mountains.length; i++){
            this.mountains[i].draw(this.svg, this.height);
        }
    }

}

function generateOGColors(){
    let colors = [];
    colors.push(hslToHex(34, 0.50, 0.90))
    colors.push(hslToHex(34, 0.85, 0.75))
    colors.push(hslToHex(184, 0.20, 0.60))
    colors.push(hslToHex(194, 0.45, 0.40))
    colors.push(hslToHex(184, 0.20, 0.20))

    return colors;
}

function generateOGRandomColors(){

    let hue = Math.ceil(Math.random()*360);

    let colors = [];
    colors.push(hslToHex(hue, 0.50, 0.90))
    colors.push(hslToHex(hue, 0.85, 0.75))
    colors.push(hslToHex((hue+150)%360, 0.20, 0.60))
    colors.push(hslToHex((hue+160)%360, 0.45, 0.40))
    colors.push(hslToHex((hue+150)%360, 0.20, 0.20))

    return colors;
}

function generateRandomColors(){

    let hue1 = Math.ceil(Math.random()*360);
    let hue2 = 0;
    do {hue2 = Math.ceil(Math.random()*360)} while(Math.abs(hue2-hue1) < 60) ;

    let colors = [];
    colors.push(hslToHex(hue1, 0.50, 0.90))
    colors.push(hslToHex(hue1, 0.85, 0.75))
    colors.push(hslToHex(hue2, 0.20, 0.60))
    colors.push(hslToHex(hue2+10, 0.45, 0.40))
    colors.push(hslToHex(hue2, 0.20, 0.20))

    return colors;
}

function hslToHex(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

