class Sun{
    constructor(color, minRadius, maxRadius, minX, maxX, minY,  maxY){
        this.color = color;
        this.r = 120;

    }

    draw(svg){
        svg.append("circle")
            .attr('cx', 150)
            .attr('cy', 220)
            .attr('r', this.r)
            .style('fill', this.color);
    }
}

class MountainRange{
    constructor(color, width, baseY, lateralVariation, minPoints, maxPoints, minSubdiv, maxSubdiv){
        this.color = color;
        this.width = width;
        this.baseY = baseY;

    }

    draw(svg, height){
        svg.append("rect")
            .attr("x", 0)
            .attr("y", this.baseY)
            .attr("width", this.width)
            .attr("height", height-this.baseY)
            .attr("fill", this.color);
    }
}


class Canvas{

    constructor(){

        //canvas config
        this.width = 400;
        this.height = 600;
        this.colors = ["#ede6d6", "#f9c792", "#85aeaa", "#388199", "#323232"]

        //sun config
        this.radius = [60, 120];
        this.sunAllowable = 0.4;

        //mountains config
        this.ys = [200, 350, 450];
        this.latVar = [0, 0, 0];
        this.nPoints = [[0, 0],[0, 0],[0, 0]];
        this.nSubdiv = [[0, 0],[0, 0],[0, 0]];


        //initialize pieces
        this.sun = new Sun(
            this.colors[1], 
            this.radius[0], 
            this.radius[1], 
            0, 
            this.width, 
            0, 
            (this.height*this.sunAllowable)
        );

        this.mountains = [];
        for(let i = 0; i < 3; i++){
            this.mountains.push(new MountainRange(
                this.colors[i+2], 
                this.width, 
                this.ys[i], 
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
