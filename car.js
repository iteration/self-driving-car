class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxspeed = maxSpeed;
        this.friction = 0.02;
        this.angle = 0;
        this.damaged = false;

        if (controlType === "keyboard") {
            this.sensor = new Sensor(this);
        }
        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
        }
    }

    #assessDamage(roadBorders, traffic) {
        let accident = false;
        roadBorders.map((border) => {
            if (polysIntersect(this.polygon, border)) {
                console.info("💥 Crash! 💥");
                accident = true;
            }
        });

        traffic.map((car) => {
            if (polysIntersect(this.polygon, car.polygon)) {
                console.info("🚓 Collision!💥");
                accident = true;
            }
        });

        return accident;
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });
        return points;
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }

        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        //speed limit
        if (this.speed > this.maxspeed) {
            this.speed = this.maxspeed;
        }

        // reverse
        if (this.speed < -this.maxspeed / 2) {
            this.speed = -this.maxspeed / 2;
        }

        // friction adjustment
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        // prevent speed from bouncing forward and reverse
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx) {
        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = "black";
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        if (this.sensor) {
            this.sensor.draw(ctx);
        }
    }
}
