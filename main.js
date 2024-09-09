let shots = [];
let legend = {
    location: { x: 1240, y: 720 },
    elements: [],
};

let centerX;
let centerY;
let timeout;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    init();
}
function init() {
    centerX = width * 0.4;
    centerY = height / 2;

    background(20);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    init_shots();
    init_legend();
}

function init_legend() {
    legend.location.x = width * 0.85;
    legend.location.y = height * 0.83;
    legend.elements = [];
    legend.elements.push({
        ttlRange: 50,
        ttlEnemy: 100,
        angle: Math.random() * 2 * Math.PI,
        amplitude: Math.random() * height + 400,
        type: "circle",
    });
    legend.elements.push({
        ttlRange: 50,
        ttlEnemy: 100,
        angle: Math.random() * 2 * Math.PI,
        amplitude: Math.random() * height + 400,
        type: "square",
    });
    legend.elements.push({
        ttlRange: 50,
        ttlEnemy: 100,
        angle: Math.random() * 2 * Math.PI,
        amplitude: Math.random() * height + 400,
        type: "triangle",
    });
}

function mouseDragged() {
    // centerX = mouseX;
    // centerY = mouseY;
    console.log(mouseX, mouseY);
}

function init_shots() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        if (shots.length < 3) {
            for (let i = 0; i < Math.floor(2 * Math.expm1(Math.random())); i++) {
                shots.push({
                    ttlRange: 50,
                    ttlEnemy: 100,
                    angle: Math.random() * 2 * Math.PI,
                    amplitude: Math.random() * height + 400,
                    type: ["circle", "triangle", "square"][Math.floor(Math.random() * 3)],
                });
            }
        }
        init_shots();
    }, Math.random() * 1000 + 500);
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    init();
}

function draw() {
    background(30);

    // draw_gridlines();
    draw_crosshair();
    draw_circles();
    draw_shots();
    draw_enemies();
    deal_with_shots();
    draw_legend();
}

function draw_gridlines() {
    const gridSize = 100;
    const numCols = width / gridSize;
    const numRows = height / gridSize;
    stroke(255, 30);
    setLineDash();
    for (let i = 0; i < numCols; i++) {
        line(i * gridSize, 0, i * gridSize, height);
    }
    for (let j = 0; j < numRows; j++) {
        line(0, j * gridSize, width, j * gridSize);
    }
    removeLineDash();
}

function draw_enemies() {
    fill(120, 0, 0);
    for (const shot of shots) {
        const x = centerX + (shot.amplitude / 2) * Math.cos(shot.angle);
        const y = centerY + (shot.amplitude / 2) * Math.sin(shot.angle);

        if (shot.type == "circle") {
            stroke(0, 255, 255, shot.ttlEnemy);
            fill(0, 255, 255, shot.ttlRange);
            circle(x, y, 30, 30);
        } else if (shot.type == "square") {
            stroke(0, 255, 0, shot.ttlEnemy);
            // noFill();
            fill(0, 255, 0, shot.ttlRange);
            rect(x, y, 30, 30, 4);
        } else {
            stroke(255, 0, 0, shot.ttlEnemy);
            fill(255, 0, 0, shot.ttlRange);
            triangle(x, y, x + 17, y + 17, x - 17, y + 17);
        }
    }
}

function draw_shots() {
    const accuracy = (15 * Math.PI) / 180;

    fill(120, 0, 120);
    for (const shot of shots) {
        const x1 = centerX + 2 * shot.amplitude * Math.cos(shot.angle + accuracy);
        const y1 = centerY + 2 * shot.amplitude * Math.sin(shot.angle + accuracy);
        const x2 = centerX + 2 * shot.amplitude * Math.cos(shot.angle - accuracy);
        const y2 = centerY + 2 * shot.amplitude * Math.sin(shot.angle - accuracy);

        stroke(255, 51, 102, shot.ttlRange + 20);
        line(centerX, centerY, x1, y1);
        line(centerX, centerY, x2, y2);
        fill(255, 97, 136, shot.ttlRange);
        arc(centerX, centerY, shot.amplitude * 4, shot.amplitude * 4, shot.angle - accuracy, shot.angle + accuracy);
    }
}

function draw_circles() {
    const r = 175;
    noFill();
    stroke(120);
    setLineDash();
    for (let i = 1; i <= 5; i++) {
        circle(centerX, centerY, r * i);
    }
    removeLineDash();
}

function draw_crosshair() {
    const p = 20;
    stroke(255);
    strokeWeight(2);
    removeLineDash();
    line(centerX - p, centerY, centerX + p, centerY);
    line(centerX, centerY - p, centerX, centerY + p);
    stroke(255, 30);
    strokeWeight(2);
    setLineDash();
    line(centerX - p * 25, centerY, centerX + p * 25, centerY);
    line(centerX, centerY - p * 25, centerX, centerY + p * 25);
    removeLineDash();
}

function removeLineDash() {
    drawingContext.setLineDash([]); //longer stitches
}

function setLineDash() {
    drawingContext.setLineDash([10, 10]); //longer stitches
}

function deal_with_shots() {
    for (let i = 0; i < shots.length; i++) {
        shots[i].ttlEnemy -= 0.5;
        shots[i].ttlRange--;
    }
    shots = shots.filter((i) => i.ttlEnemy > 0 || i.ttlRange > 0);
}

function draw_legend() {
    const w = 200;
    const h = 250;

    let x = legend.location.x - w / 4 - w / 8;

    stroke(255);
    fill(40);
    rect(legend.location.x - 5, legend.location.y, w, h, 1);

    const textX = legend.location.x - w / 2 + w / 10;
    const textY = legend.location.y - h / 2;
    stroke(200);
    fill(255);
    textSize(18);
    strokeWeight(0.25);
    text("Active gunfire", textX + w / 8, textY + h / 8, 100, 100);
    text("Past gunfire", textX + w / 2 + w / 6, textY + h / 8, 100, 100);
    strokeWeight(1);

    for (let i = 0; i < legend.elements.length; i++) {
        const shot = legend.elements[i];

        const y = legend.location.y - h / 2 + h / 8 + ((i + 1) * h) / 4;

        if (shot.type == "circle") {
            stroke(0, 255, 255, 200);
            fill(0, 255, 255, 200);

            circle(x, y, 30, 30);
            stroke(0, 200, 200);
            fill(0, 200, 200);
            // stroke(200);
            // fill(200);
            text("Firearm 1", x + w / 3, y);
        } else if (shot.type == "square") {
            stroke(0, 255, 0, 200);
            noFill();
            fill(0, 255, 0, 200);
            rect(x, y, 30, 30, 4);
            stroke(0, 200, 0);
            fill(0, 200, 0);
            text("Firearm 2", x + w / 3, y);
        } else {
            stroke(255, 0, 0, 200);
            fill(255, 0, 0, 200);
            triangle(x, y - 5, x + 17, y - 5 + 17, x - 17, y - 5 + 17);
            stroke(200, 0, 0);
            fill(200, 0, 0);
            text("Firearm 3", x + w / 3, y);
        }
    }

    x = legend.location.x + w / 3.5;

    for (let i = 0; i < legend.elements.length; i++) {
        const shot = legend.elements[i];

        const y = legend.location.y - h / 2 + h / 8 + ((i + 1) * h) / 4;

        noFill();
        if (shot.type == "circle") {
            stroke(0, 255, 255, 200);

            circle(x, y, 30, 30);
        } else if (shot.type == "square") {
            stroke(0, 255, 0, 200);
            rect(x, y, 30, 30, 4);
        } else {
            stroke(255, 0, 0, 200);
            triangle(x, y - 5, x + 17, y - 5 + 17, x - 17, y - 5 + 17);
        }
    }
}
