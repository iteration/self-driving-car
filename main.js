const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
//const car = new Car(road.getLaneCenter(1), 100, 30, 50, "keyboard");
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), 400, 30, 50, "DUMMY", 7),
    new Car(road.getLaneCenter(2), -25, 30, 50, "DUMMY", 2.5),
];

animate();

console.info("🏁 Start your engines! 🏁");

function animate() {
    traffic.map((c) => c.update(road.borders, []));
    car.update(road.borders, traffic);

    canvas.height = window.innerHeight; //this will reset the canvas

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    road.draw(ctx);
    traffic.map((c) => c.draw(ctx));
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}
