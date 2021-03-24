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
    constructor(color, width, baseY, maxDeltaY, lateralVariation, minPoints, maxPoints, minSubdiv, maxSubdiv){
        this.color = color;
        this.width = width;
        this.baseY = baseY;
        this.maxDeltaY = maxDeltaY;
        this.lateralVariation = lateralVariation;
        this.minPoints = minPoints;
        this.maxPoints = maxPoints;
        this.dp = maxPoints - minPoints;
        this.n = Math.ceil(Math.random() * this.dp) + minPoints + 2;
        this.minSubdic = minSubdiv;
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

        this.points = [];
        let sign = Math.sign(Math.random()-0.5);
        
        for(let i = 0; i<=this.n;i++){
            let dx = this.width/(this.n-1);
            let x = (i === 0 || i === this.n) ? (dx*i) : (dx*i) + (dx*this.lateralVariation);
            let y = sign*Math.random()*this.maxDeltaY + this.baseY;
            sign*=-1;
            this.points.push({x:x,y:y});
        }


    }
}


class Canvas{

    constructor(){

        //canvas config
        this.width = 400;
        this.height = 600;
        this.colors = ["#ede6d6", "#f9c792", "#85aeaa", "#388199", "#323232"]

        //sun config
        this.radius = [80, 160];
        this.sunAllowable = 0.6;

        //mountains config
        this.ys = [300, 400, 500];
        this.maxDeltaYs = [120,40,40]
        this.latVar = [0.4, 0.2, 0.2];
        this.nPoints = [[1, 1],[3, 3],[3, 3]];
        this.nSubdiv = [[0, 0],[0, 0],[0, 0]];


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
                this.ys[i], 
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

