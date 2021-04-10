import game from "./../game.js";
import video from "./../video/video.js";
import event from "./../system/event.js";
import {nextPowerOfTwo} from "./../math/math.js";
import pool from "./../system/pooling.js";
import Renderable from "./../renderable/renderable.js";
import Stage from "./../state/stage.js";


// a basic progress bar object
var ProgressBar = Renderable.extend({
    /**
     * @ignore
     */
    init: function (x, y, w, h) {
        var self = this;

        this.barHeight = h;

        this._super(Renderable, "init", [x, y, w, h]);

        this.anchorPoint.set(0, 0);

        this.loaderHdlr = event.subscribe(
            event.LOADER_PROGRESS,
            self.onProgressUpdate.bind(self)
        );

        this.resizeHdlr = event.subscribe(
            event.VIEWPORT_ONRESIZE,
            self.resize.bind(self)
        );

        // store current progress
        this.progress = 0;
    },

    /**
     * make sure the screen is refreshed every frame
     * @ignore
     */
    onProgressUpdate : function (progress) {
        this.progress = ~~(progress * this.width);
        this.isDirty = true;
    },

    /**
     * draw function
     * @ignore
     */
    draw : function (renderer) {
        // clear the background
        renderer.clearColor("#202020");

        // draw the progress bar
        renderer.setColor("black");
        renderer.fillRect(this.pos.x, game.viewport.centerY, renderer.getWidth(), this.barHeight / 2);

        renderer.setColor("#55aa00");
        renderer.fillRect(this.pos.x, game.viewport.centerY, this.progress, this.barHeight / 2);
    },

    /**
     * Called by engine before deleting the object
     * @ignore
     */
    onDestroyEvent : function () {
        // cancel the callback
        event.unsubscribe(this.loaderHdlr);
        event.unsubscribe(this.resizeHdlr);
        this.loaderHdlr = this.resizeHdlr = null;
    }

});

/**
 * a default loading screen
 * @memberOf me
 * @ignore
 * @constructor
 */
var defaultLoadingScreen = new Stage({
    /**
     * call when the loader is resetted
     * @ignore
     */
    onResetEvent : function () {
        var barHeight = 8;

        // // progress bar
        // game.world.addChild(new ProgressBar(
        //     0,
        //     video.renderer.getHeight() / 2,
        //     video.renderer.getWidth(),
        //     barHeight
        // ), 1);


    }
});

export default defaultLoadingScreen;
