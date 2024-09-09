let shots = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(20);
    rectMode(CENTER);
    init_shots();
}

function init_shots() {
    // shots = [];
    // shots.push({
    //     ttlRange: 50,
    //     ttlEnemy: 100,
    //     angle: Math.random() * 2 * Math.PI,
    //     amplitude: Math.random() * height + 400,
    //     type: "circle",
    // });
    // shots.push({
    //     ttlRange: 50,
    //     ttlEnemy: 100,
    //     angle: Math.random() * 2 * Math.PI,
    //     amplitude: Math.random() * height + 400,
    //     type: "square",
    // });
    // shots.push({
    //     ttlRange: 50,
    //     ttlEnemy: 100,
    //     angle: Math.random() * 2 * Math.PI,
    //     amplitude: Math.random() * height + 400,
    //     type: "triangle",
    // });
    setTimeout(() => {
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

function draw() {
    background(30);

    draw_crosshair();
    draw_circles();
    draw_shots();
    draw_enemies();
    deal_with_shots();
}

function draw_enemies() {
    const centerX = width / 2;
    const centerY = height / 2;

    fill(120, 0, 0);
    for (const shot of shots) {
        const x = centerX + (shot.amplitude / 2) * Math.cos(shot.angle);
        const y = centerY + (shot.amplitude / 2) * Math.sin(shot.angle);

        if (shot.type == "circle") {
            stroke(0, 255, 255, shot.ttlEnemy);
            fill(0, 255, 255, shot.ttlEnemy);
            circle(x, y, 30, 30);
        } else if (shot.type == "square") {
            stroke(0, 255, 0, shot.ttlEnemy);
            noFill();
            // fill(0, 255, 0, shot.ttlEnemy);
            rect(x, y, 30, 30, 2);
        } else {
            stroke(255, 0, 0, shot.ttlEnemy);
            fill(255, 0, 0, shot.ttlEnemy);
            triangle(x, y, x + 15, y + 15, x - 15, y + 15);
        }
    }
}

function draw_shots() {
    const centerX = width / 2;
    const centerY = height / 2;

    const accuracy = (15 * Math.PI) / 180;

    fill(120, 0, 120);
    for (const shot of shots) {
        const x1 = centerX + 2 * shot.amplitude * Math.cos(shot.angle + accuracy);
        const y1 = centerY + 2 * shot.amplitude * Math.sin(shot.angle + accuracy);
        const x2 = centerX + 2 * shot.amplitude * Math.cos(shot.angle - accuracy);
        const y2 = centerY + 2 * shot.amplitude * Math.sin(shot.angle - accuracy);

        stroke(255, 51, 102, shot.ttlEnemy);
        line(centerX, centerY, x1, y1);
        line(centerX, centerY, x2, y2);
        fill(255, 97, 136, shot.ttlRange);
        arc(centerX, centerY, shot.amplitude * 4, shot.amplitude * 4, shot.angle - accuracy, shot.angle + accuracy);
    }
}

function draw_circles() {
    const centerX = width / 2;
    const centerY = height / 2;
    const r = 200;
    noFill();
    stroke(120);
    setLineDash();
    for (let i = 1; i <= 5; i++) {
        circle(centerX, centerY, r * i);
    }
    removeLineDash();
}

function draw_crosshair() {
    const centerX = width / 2;
    const centerY = height / 2;
    const p = 20;
    stroke(255);
    strokeWeight(2);
    removeLineDash();
    line(centerX - p, centerY, centerX + p, centerY);
    line(centerX, centerY - p, centerX, centerY + p);
}

function removeLineDash() {
    drawingContext.setLineDash([]); //longer stitches
}

function setLineDash() {
    drawingContext.setLineDash([10, 10]); //longer stitches
}

function deal_with_shots() {
    for (let i = 0; i < shots.length; i++) {
        shots[i].ttlEnemy--;
        shots[i].ttlRange--;
    }
    shots = shots.filter((i) => i.ttlEnemy > 0 || i.ttlRange > 0);
}
