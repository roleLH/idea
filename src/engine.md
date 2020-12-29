### How to work
state   
    Stages   
        cameras

        update(dt) {
            game.world.update(dt)
            cameras.update_all(dt)
        }
        draw(renderer) {
            cameras.draw_all(renderer, game.world)
        }


Camera
    update(dt) {

    }
    draw(renderer, container) {
        container.draw_all(renderer, this)
    }


Container
    update(dt) {
        children.update_all(dt)
    }
    draw(renderer, rect) {
        children.draw_all(renderer, rect)
    }