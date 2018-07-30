class Arc {
    constructor(start, end, direction, reverse = true) {
        this.start = start; // global index
        this.end = end; // global next
        this.direction = direction; // up/down arc
        this.reverse = reverse; // if next number can go backward
    }

    render() {
        stroke(255);
        strokeWeight(0.5);
        noFill();

        let diameter = abs(this.start - this.end);
        let x = (this.start + this.end) / 2;
        let angle = this.direction ? 0 : PI;

        arc(x, 0, diameter, diameter, angle, angle + PI);
    }

    generatePoints() {
        angleMode(DEGREES);
        let arcPoints = [];
        let r = abs((this.start - this.end)) / 2;
        // next arc should start at the end of previous
        // or the end of previous depends on moving direction (backward / forward)
        let startX = this.reverse ? this.end : this.start;

        let iteration = 0;
        let runTimes = 180;
        let doPush = false;
        if(!this.direction) {
            iteration = 180;
            runTimes = 360;
            doPush = true;
        }

        for(let i = iteration; i <= runTimes; i += arcIterationStep) {
            let x = r * cos(i);
            let y = r * sin(i);

            this.pushOrUnshift(doPush, arcPoints, {
                x: startX + x + r,
                y: y
            });
        }

        if(this.reverse) arcPoints = arcPoints.reverse();
        angleMode(RADIANS);

        return arcPoints;
    }

    pushOrUnshift(doPush, arr, obj) {
        doPush ? arr.push(obj) : arr.unshift(obj);
    }
}