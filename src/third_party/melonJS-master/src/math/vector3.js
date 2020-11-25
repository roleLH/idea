import {clamp} from "./math.js";
import pool from "./../system/pooling.js";

/**
 * @classdesc
 * a generic 3D Vector Object
 * @class Vector3d
 * @memberOf me
 * @constructor
 * @param {Number} [x=0] x value of the vector
 * @param {Number} [y=0] y value of the vector
 * @param {Number} [z=0] z value of the vector
 */

class Vector3d {

    constructor(x = 0, y = 0, z = 0) {
        this.onResetEvent(x, y, z);
    }

    /**
     * @ignore
     */
    onResetEvent(x = 0, y = 0, z = 0) {
        // this is to enable proper object pooling
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /**
     * @ignore */
    _set(x, y, z = 0) {
        return this.onResetEvent(x, y, z);
    }

    /**
     * set the Vector x and y properties to the given values<br>
     * @name set
     * @memberOf me.Vector3d
     * @function
     * @param {Number} x
     * @param {Number} y
     * @param {Number} [z=0]
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    set(x, y, z) {
        if (x !== +x || y !== +y || (typeof z !== "undefined" && z !== +z)) {
            throw new Error(
                "invalid x, y, z parameters (not a number)"
            );
        }

        /**
         * x value of the vector
         * @public
         * @type Number
         * @name x
         * @memberOf me.Vector3d
         */
        //this.x = x;

        /**
         * y value of the vector
         * @public
         * @type Number
         * @name y
         * @memberOf me.Vector3d
         */
        //this.y = y;

        /**
         * z value of the vector
         * @public
         * @type Number
         * @name z
         * @memberOf me.Vector3d
         */
        //this.z = z;

        return this._set(x, y, z);
    }

    /**
     * set the Vector x and y properties to 0
     * @name setZero
     * @memberOf me.Vector3d
     * @function
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    setZero() {
        return this.set(0, 0, 0);
    }

    /**
     * set the Vector x and y properties using the passed vector
     * @name setV
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector2d|me.Vector3d} v
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    setV(v) {
        return this._set(v.x, v.y, v.z);
    }

    /**
     * Add the passed vector to this vector
     * @name add
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector2d|me.Vector3d} v
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    add(v) {
        return this._set(this.x + v.x, this.y + v.y, this.z + (v.z || 0));
    }

    /**
     * Substract the passed vector to this vector
     * @name sub
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector2d|me.Vector3d} v
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    sub(v) {
        return this._set(this.x - v.x, this.y - v.y, this.z - (v.z || 0));
    }

    /**
     * Multiply this vector values by the given scalar
     * @name scale
     * @memberOf me.Vector3d
     * @function
     * @param {Number} x
     * @param {Number} [y=x]
     * @param {Number} [z=1]
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    scale(x, y, z) {
        y = (typeof (y) !== "undefined" ? y : x);
        return this._set(this.x * x, this.y * y, this.z * (z || 1));
    }

    /**
     * Multiply this vector values by the passed vector
     * @name scaleV
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector2d|me.Vector3d} v
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    scaleV(v) {
        return this.scale(v.x, v.y, v.z);
    }

    /**
     * Convert this vector into isometric coordinate space
     * @name toIso
     * @memberOf me.Vector3d
     * @function
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    toIso() {
        return this._set(this.x - this.y, (this.x + this.y) * 0.5, this.z);
    }

    /**
     * Convert this vector into 2d coordinate space
     * @name to2d
     * @memberOf me.Vector3d
     * @function
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    to2d() {
        return this._set(this.y + this.x / 2, this.y - this.x / 2, this.z);
    }

    /**
     * Divide this vector values by the passed value
     * @name div
     * @memberOf me.Vector3d
     * @function
     * @param {Number} value
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    div(n) {
        return this._set(this.x / n, this.y / n, this.z / n);
    }

    /**
     * Update this vector values to absolute values
     * @name abs
     * @memberOf me.Vector3d
     * @function
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    abs() {
        return this._set((this.x < 0) ? -this.x : this.x, (this.y < 0) ? -this.y : this.y, (this.z < 0) ? -this.z : this.z);
    }

    /**
     * Clamp the vector value within the specified value range
     * @name clamp
     * @memberOf me.Vector3d
     * @function
     * @param {Number} low
     * @param {Number} high
     * @return {me.Vector3d} new me.Vector3d
     */
    clamp(low, high) {
        return new Vector3d(clamp(this.x, low, high), clamp(this.y, low, high), clamp(this.z, low, high));
    }

    /**
     * Clamp this vector value within the specified value range
     * @name clampSelf
     * @memberOf me.Vector3d
     * @function
     * @param {Number} low
     * @param {Number} high
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    clampSelf(low, high) {
        return this._set(clamp(this.x, low, high), clamp(this.y, low, high), clamp(this.z, low, high));
    }

    /**
     * Update this vector with the minimum value between this and the passed vector
     * @name minV
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector2d|me.Vector3d} v
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    minV(v) {
        var _vz = v.z || 0;
        return this._set((this.x < v.x) ? this.x : v.x, (this.y < v.y) ? this.y : v.y, (this.z < _vz) ? this.z : _vz);
    }

    /**
     * Update this vector with the maximum value between this and the passed vector
     * @name maxV
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector2d|me.Vector3d} v
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    maxV(v) {
        var _vz = v.z || 0;
        return this._set((this.x > v.x) ? this.x : v.x, (this.y > v.y) ? this.y : v.y, (this.z > _vz) ? this.z : _vz);
    }

    /**
     * Floor the vector values
     * @name floor
     * @memberOf me.Vector3d
     * @function
     * @return {me.Vector3d} new me.Vector3d
     */
    floor() {
        return new Vector3d(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }

    /**
     * Floor this vector values
     * @name floorSelf
     * @memberOf me.Vector3d
     * @function
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    floorSelf() {
        return this._set(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }

    /**
     * Ceil the vector values
     * @name ceil
     * @memberOf me.Vector3d
     * @function
     * @return {me.Vector3d} new me.Vector3d
     */
    ceil() {
        return new Vector3d(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
    }

    /**
     * Ceil this vector values
     * @name ceilSelf
     * @memberOf me.Vector3d
     * @function
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    ceilSelf() {
        return this._set(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
    }

    /**
     * Negate the vector values
     * @name negate
     * @memberOf me.Vector3d
     * @function
     * @return {me.Vector3d} new me.Vector3d
     */
    negate() {
        return new Vector3d(-this.x, -this.y, -this.z);
    }

    /**
     * Negate this vector values
     * @name negateSelf
     * @memberOf me.Vector3d
     * @function
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    negateSelf() {
        return this._set(-this.x, -this.y, -this.z);
    }

    /**
     * Copy the components of the given vector into this one
     * @name copy
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector2d|me.Vector3d} v
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    copy(v) {
        return this._set(v.x, v.y, v.z || 0);
    }

    /**
     * return true if the two vectors are the same
     * @name equals
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector2d|me.Vector3d} v
     * @return {Boolean}
     */
    equals(v) {
        return ((this.x === v.x) && (this.y === v.y) && (this.z === (v.z || this.z)));
    }

    /**
     * normalize this vector (scale the vector so that its magnitude is 1)
     * @name normalize
     * @memberOf me.Vector3d
     * @function
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    normalize() {
        return this.div(this.length() || 1);
    }

    /**
     * change this vector to be perpendicular to what it was before.<br>
     * (Effectively rotates it 90 degrees in a clockwise direction around the z axis)
     * @name perp
     * @memberOf me.Vector3d
     * @function
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    perp() {
        return this._set(this.y, -this.x, this.z);
    }

    /**
     * Rotate this vector (counter-clockwise) by the specified angle (in radians) around the z axis
     * @name rotate
     * @memberOf me.Vector3d
     * @function
     * @param {number} angle The angle to rotate (in radians)
     * @param {me.Vector2d|me.ObservableVector2d} [v] an optional point to rotate around (on the same z axis)
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    rotate(angle, v) {
        var cx = 0;
        var cy = 0;

        if (typeof v === "object") {
            cx = v.x;
            cy = v.y;
        }

        // TODO also rotate on the z axis if the given vector is a 3d one
        var x = this.x - cx;
        var y = this.y - cy;

        var c = Math.cos(angle);
        var s = Math.sin(angle);

        return this._set(x * c - y * s + cx, x * s + y * c + cy, this.z);
    }

    /**
     * return the dot product of this vector and the passed one
     * @name dotProduct
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector2d|me.Vector3d} v
     * @return {Number} The dot product.
     */
    dotProduct(v) {
        return this.x * v.x + this.y * v.y + this.z * (typeof(v.z) !== "undefined" ? v.z : this.z);
    }

   /**
     * return the square length of this vector
     * @name length2
     * @memberOf me.Vector3d
     * @function
     * @return {Number} The length^2 of this vector.
     */
    length2() {
        return this.dotProduct(this);
    }

    /**
     * return the length (magnitude) of this vector
     * @name length
     * @memberOf me.Vector3d
     * @function
     * @return {Number} the length of this vector
     */
    length() {
        return Math.sqrt(this.length2());
    }

    /**
     * Linearly interpolate between this vector and the given one.
     * @name lerp
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector3d} v
     * @param {Number} alpha distance along the line (alpha = 0 will be this vector, and alpha = 1 will be the given one).
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    lerp(v, alpha) {
        this.x += ( v.x - this.x ) * alpha;
        this.y += ( v.y - this.y ) * alpha;
        this.z += ( v.z - this.z ) * alpha;
        return this;
    }

    /**
     * return the distance between this vector and the passed one
     * @name distance
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector2d|me.Vector3d} v
     * @return {Number}
     */
    distance(v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        var dz = this.z - (v.z || 0);
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * return the angle between this vector and the passed one
     * @name angle
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector2d|me.Vector3d} v
     * @return {Number} angle in radians
     */
    angle(v) {
        return Math.acos(clamp(this.dotProduct(v) / (this.length() * v.length()), -1, 1));
    }

    /**
     * project this vector on to another vector.
     * @name project
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector2d|me.Vector3d} v The vector to project onto.
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    project(v) {
        var ratio = this.dotProduct(v) / v.length2();
        return this.scale(ratio, ratio, ratio);
    }

    /**
     * Project this vector onto a vector of unit length.<br>
     * This is slightly more efficient than `project` when dealing with unit vectors.
     * @name projectN
     * @memberOf me.Vector3d
     * @function
     * @param {me.Vector2d|me.Vector3d} v The unit vector to project onto.
     * @return {me.Vector3d} Reference to this object for method chaining
     */
    projectN(v) {
        var ratio = this.dotProduct(v) / v.length2();
        return this.scale(ratio, ratio, ratio);
    }

    /**
     * return a clone copy of this vector
     * @name clone
     * @memberOf me.Vector3d
     * @function
     * @return {me.Vector3d} new me.Vector3d
     */
    clone() {
        return pool.pull("me.Vector3d", this.x, this.y, this.z);
    }

    /**
     * convert the object to a string representation
     * @name toString
     * @memberOf me.Vector3d
     * @function
     * @return {String}
     */
    toString() {
        return "x:" + this.x + ",y:" + this.y + ",z:" + this.z;
    }
};

export default Vector3d;
