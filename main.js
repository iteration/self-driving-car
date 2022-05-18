const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
//const car = new Car(road.getLaneCenter(1), 400, 30, 50, "keyboard");
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), 400, 30, 50, "DUMMY", 7),
    new Car(road.getLaneCenter(2), -25, 30, 50, "DUMMY", 2.5),
];

animate();

console.info("🏁 Start your engines! 🏁");

function animate(time) {
    traffic.map((c) => c.update(road.borders, []));
    car.update(road.borders, traffic);

    carCanvas.height = window.innerHeight; //this will reset the canvas
    networkCanvas.height = window.innerHeight; //this will reset the canvas

    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    traffic.map((c) => c.draw(carCtx));
    car.draw(carCtx);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 25;
    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(animate);
}
