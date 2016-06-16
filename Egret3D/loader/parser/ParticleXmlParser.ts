﻿module egret3d {
    /**
     * @private 
     * @language zh_CN
     * @class egret3d.ParticleXmlParser
     * @classdesc
     * 用 ParticleXmlParser 解析粒子文件
     */
    export class ParticleXmlParser {

        /**
         * @language zh_CN
         * 粒子的版本号
         * @version Egret 3.0
         * @platform Web,Native
         */
        public version: number = 1;

        private _particleData: ParticleData;
        private _xml: any;
        /**
        * @language zh_CN
        * constructor 
        */
        constructor() {

        }

        /**
         * @language zh_CN
         * @param xml 粒子特效的数据解析
         * @returns ParticleData
         */
        public parse(text: string): ParticleData {
            this._particleData = new ParticleData();

            this._xml = XmlParser.parsingXML(text);

            this.version = Number(this.getNode(this._xml, "version").textContent);
            //property
            var propertyNode: Node = this.getNode(this._xml,"property");
            this.parseProperty(propertyNode);
            //emission
            var emissionNode: Node = this.getNode(this._xml, "emission");
            this.parseEmission(emissionNode);
            //life
            var life: Node = this.getNode(this._xml, "life");
            this.parseLife(life);
            //shape
            var shape: Node = this.getNode(this._xml, "shape");
            this.parseShape(shape);
            //rotationBirth
            var rotationBirth: Node = this.getNode(this._xml, "rotationBirth");
            this.parseRotationBirth(rotationBirth);
            //scaleBirth
            var scaleBirth: Node = this.getNode(this._xml, "scaleBirth");
            this.parseScaleBirth(scaleBirth);
            //geometry
            var geometry: Node = this.getNode(this._xml, "geometry");
            this.parseGeometry(geometry);
            //moveSpeed
            var moveSpeed: Node = this.getNode(this._xml, "moveSpeed");
            this.parseMoveSpeed(moveSpeed);
            //followTarget
            //var followTarget: Node = this.getNode(this._xml, "followTarget");
            //this.parseFollowTarget(followTarget);
            //parseBezierNode
            var scaleBezier: Node = this.getNode(this._xml, "scaleBezier");
            this.parseScaleBeizer(scaleBezier);
            //rotationSpeed
            var rotationSpeed: Node = this.getNode(this._xml, "rotationSpeed");
            this.parseRotationSpeed(rotationSpeed);
            //colorOffset
            var colorOffset: Node = this.getNode(this._xml, "colorOffset");
            this.parseColorOffset(colorOffset);



            return this._particleData;
        }

        private parseProperty(node: Node): void {
            var property: ParticleDataProperty = this._particleData.property;

            property.particleCount = Number(this.getNode(node, "particleCount").textContent);

            var bounds: Node = this.getNode(node, "bounds");
            property.bounds = this.parseVector3D(bounds, property.bounds);

            var color: number = Number(this.getNode(node, "startColorFrom").textContent);
            property.startColorFrom = Color.createColor(color);
            var color: number = Number(this.getNode(node, "startColorTo").textContent);
            property.startColorTo = Color.createColor(color);

            property.gravity = Number(this.getNode(node, "gravity").textContent);

            var transform: Node = this.getNode(node, "transform");
            var rotation: Node = this.getNode(transform, "rotation");
            var scale: Node = this.getNode(transform, "scale");
            var position: Node = this.getNode(transform, "position");

            property.rotation = this.parseVector3D(rotation, property.rotation);
            property.scale = this.parseVector3D(scale, property.scale);
            property.position = this.parseVector3D(position, property.position);
        }


        private parseEmission(node: Node): void {
            var emission: ParticleDataEmission = this._particleData.emission;
            emission.type = ParticleValueType[this.getNode(node, "type").textContent];
            emission.rate = Number(this.getNode(node, "rate").textContent);
            var bursts: Node = this.getNode(node, "bursts");
            var item: Node;
            var nodeName: string;
            var i: number = 0;
            var count: number = 0;
            var pt: Point;
            if (bursts) {
                emission.bursts = [];
                var itemList: NodeList = this.getNodeList(bursts, "item");
                for (i = 0, count = itemList.length; i < count; i++) {
                    item = itemList[i];
                    pt = new Point();
                    emission.bursts.push(pt);
                    this.eachAttr(item, function (label: string, value: string): void {
                        if (label == "time") {
                            pt.x = Number(value);
                        } else if (label == "count") {
                            pt.y = Number(value);
                        }
                    });
                }
            }
            var bezier: Node = this.getNode(node, "bezier");
            if (emission.type == ParticleValueType.OneBezier) {
                emission.bezier = this.parseBezierData(bezier);
            }

        }


        private parseLife(node: Node): void {
            var life: ParticleDataLife = this._particleData.life;
            life.duration = Number(this.getNode(node, "duration").textContent);
            life.lifeMax = Number(this.getNode(node, "lifeMax").textContent);
            life.lifeMin = Number(this.getNode(node, "lifeMin").textContent);
            life.delay = Number(this.getNode(node, "delay").textContent);
            life.loop = this.getNode(node, "loop").textContent == "true";

        }


        private parseShape(node: Node): void {
            var shape: ParticleDataShape = this._particleData.shape;
            shape.type = ParticleDataShape[this.getNode(node, "type").textContent];
            shape.randomDirection = this.getNode(node, "randomDirection").textContent == "true";
            var cube: Node = this.getNode(node, "cube");
            this.eachAttr(cube, function (label: string, value: string): void {
                if (label == "width") {
                    shape.cubeW = Number(value);
                } else if (label == "height") {
                    shape.cubeH = Number(value);
                } else if (label == "depth") {
                    shape.cubeD = Number(value);
                }
            });
            shape.sphereRadius = Number(this.getNode(node, "sphereRadius").textContent);

        }

        private parseRotationBirth(node: Node): void {
            var rotationBirth: ParticleDataRotationBirth = this._particleData.rotationBirth;
            var min: Node = this.getNode(node, "min");
            var max: Node = this.getNode(node, "max");
            rotationBirth.min = this.parseVector3D(min, rotationBirth.min);
            rotationBirth.max = this.parseVector3D(max, rotationBirth.max);

        }


        private parseScaleBirth(node: Node): void {
            var scaleBirth: ParticleDataScaleBirth = this._particleData.scaleBirth;
            var min: Node = this.getNode(node, "min");
            var max: Node = this.getNode(node, "max");

            scaleBirth.min = this.parseVector3D(min, scaleBirth.min);
            scaleBirth.max = this.parseVector3D(max, scaleBirth.max);
        }


        private parseGeometry(node: Node): void {
            var geometry: ParticleDataGeometry = this._particleData.geometry;
            geometry.type = ParticleGeometryType[this.getNode(node, "type").textContent];

            var plane: Node = this.getNode(node, "plane");
            this.eachAttr(plane, function (label: string, value: string): void {
                if (label == "width") {
                    geometry.planeW = Number(value);
                } else if (label == "height") {
                    geometry.planeH = Number(value);
                }
            });

            var cube: Node = this.getNode(node, "cube");
            this.eachAttr(cube, function (label: string, value: string): void {
                if (label == "width") {
                    geometry.cubeW = Number(value);
                } else if (label == "height") {
                    geometry.cubeH = Number(value);
                } else if (label == "depth") {
                    geometry.cubeD = Number(value);
                }
            });

            var sphere: Node = this.getNode(node, "sphere");
            this.eachAttr(sphere, function (label: string, value: string): void {
                if (label == "radius") {
                    geometry.sphereRadius = Number(value);
                } else if (label == "segmentW") {
                    geometry.sphereSegW = Number(value);
                } else if (label == "segmentH") {
                    geometry.sphereSegH = Number(value);
                }
            });


        }


        
        private parseMoveSpeed(node: Node): void {
            var moveSpeed: ParticleDataMoveSpeed = this._particleData.moveSpeed;
            moveSpeed.min = Number(this.getNode(node, "min").textContent);
            moveSpeed.max = Number(this.getNode(node, "max").textContent);

            var velocityOverNode: Node = this.getNode(node, "velocityOver");
            if (velocityOverNode) {
                var velocityOver: VelocityOverLifeTimeData = new VelocityOverLifeTimeData();
                velocityOver.type = ParticleValueType[this.getNode(velocityOverNode, "type").textContent];
                var min: Node = this.getNode(velocityOverNode, "min");
                var max: Node = this.getNode(velocityOverNode, "max");
                velocityOver.min = this.parseVector3D(min, velocityOver.min);
                velocityOver.max = this.parseVector3D(max, velocityOver.max);
                velocityOver.worldSpace = this.getNode(velocityOverNode, "worldSpace").textContent == "true";

                velocityOver.xBezier1 = this.parseBezierData(this.getNode(velocityOverNode, "xBezier1"));
                velocityOver.yBezier1 = this.parseBezierData(this.getNode(velocityOverNode, "yBezier1"));
                velocityOver.zBezier1 = this.parseBezierData(this.getNode(velocityOverNode, "zBezier1"));
                velocityOver.xBezier2 = this.parseBezierData(this.getNode(velocityOverNode, "xBezier2"));
                velocityOver.yBezier2 = this.parseBezierData(this.getNode(velocityOverNode, "yBezier2"));
                velocityOver.zBezier2 = this.parseBezierData(this.getNode(velocityOverNode, "zBezier2"));

                moveSpeed.velocityOver = velocityOver;
            }


            var velocityForceNode: Node = this.getNode(node, "velocityForce");
            if (velocityForceNode) {
                var velocityForce: VelocityForceLifeTimeData = new VelocityForceLifeTimeData();
                velocityForce.type = ParticleValueType[this.getNode(velocityForceNode, "type").textContent];
                var min: Node = this.getNode(velocityForceNode, "min");
                var max: Node = this.getNode(velocityForceNode, "max");
                velocityForce.min = this.parseVector3D(min, velocityForce.min);
                velocityForce.max = this.parseVector3D(max, velocityForce.max);
                velocityForce.worldSpace = this.getNode(velocityForceNode, "worldSpace").textContent == "true";

                velocityForce.xBezier1 = this.parseBezierData(this.getNode(velocityForceNode, "xBezier1"));
                velocityForce.yBezier1 = this.parseBezierData(this.getNode(velocityForceNode, "yBezier1"));
                velocityForce.zBezier1 = this.parseBezierData(this.getNode(velocityForceNode, "zBezier1"));
                velocityForce.xBezier2 = this.parseBezierData(this.getNode(velocityForceNode, "xBezier2"));
                velocityForce.yBezier2 = this.parseBezierData(this.getNode(velocityForceNode, "yBezier2"));
                velocityForce.zBezier2 = this.parseBezierData(this.getNode(velocityForceNode, "zBezier2"));

                moveSpeed.velocityForce = velocityForce;
            }

            var velocityLimitNode: Node = this.getNode(node, "velocityLimit");
            if (velocityLimitNode) {
                var velocityLimit: VelocityLimitLifeTimeData = new VelocityLimitLifeTimeData();
                velocityLimit.type = ParticleValueType[this.getNode(velocityLimitNode, "type").textContent];
                var min: Node = this.getNode(velocityLimitNode, "min");
                var max: Node = this.getNode(velocityLimitNode, "max");
                velocityLimit.min = Number(min.textContent);
                velocityLimit.max = Number(max.textContent);

                velocityLimit.bezier1 = this.parseBezierData(this.getNode(velocityLimitNode, "bezier1"));
                velocityLimit.bezier2 = this.parseBezierData(this.getNode(velocityLimitNode, "bezier2"));

                moveSpeed.velocityLimit = velocityLimit;
            }



        }


        private parseFollowTarget(node: Node): void {
            if (node == null)
                return;
            var followTarget: ParticleDataFollowTarget = this._particleData.followTarget = new ParticleDataFollowTarget();
            followTarget.followRotation = this.getNode(node, "followRotation").textContent == "true";
            followTarget.followScale = this.getNode(node, "followScale").textContent == "true";

            
        }

        
        private parseScaleBeizer(node: Node): void {
            if (node == null)
                return;
            var scaleBesizer: ParticleDataScaleBezier = this._particleData.scaleBesizer = new ParticleDataScaleBezier();
            scaleBesizer.data = this.parseBezierData(this.getNode(node, "bezier"));
        }



        private parseRotationSpeed(node: Node): void {
            if (node == null)
                return;
            var rotationSpeed: ParticleDataRotationSpeed = this._particleData.rotationSpeed = new ParticleDataRotationSpeed();
            rotationSpeed.type = ParticleValueType[this.getNode(node, "type").textContent];
            var min: Node = this.getNode(node, "min");
            var max: Node = this.getNode(node, "max");
            rotationSpeed.min = this.parseVector3D(min, rotationSpeed.min);
            rotationSpeed.max = this.parseVector3D(max, rotationSpeed.max);

            rotationSpeed.bezier1 = this.parseBezierData(this.getNode(node, "bezier1"));
            rotationSpeed.bezier2 = this.parseBezierData(this.getNode(node, "bezier2"));

        }


        private parseColorOffset(node: Node): void {
            if (node == null)
                return;
            var colorOffset: ParticleDataColorOffset = this._particleData.colorOffset = new ParticleDataColorOffset();

            var itemList: NodeList = this.getNodeList(node, "item");
            var item: Node;
            var i: number = 0;
            var count: number = 0;
            var pt: Point;
            var color: Color;
            var time: number;

            for (i = 0, count = itemList.length; i < count; i++) {
                item = itemList[i];
                this.eachAttr(item, function (label: string, value: string): void {
                    if (label == "time") {
                        colorOffset.times.push(Number(value));
                    } else if (label == "color") {
                        color = Color.createColor(Number(value));
                        colorOffset.colors.push(color);
                    }
                });
            }

        }


        





        private parseBezierData(node: Node): BezierData {
            var bzData: BezierData = new BezierData(BezierData.PointCount);
            var posList: NodeList = this.getNodeList(node, "pos");
            var ctrlList: NodeList = this.getNodeList(node, "ctrl");
            var item: Node;
            var i: number = 0;
            var count: number = 0;
            var pt: Point;

            for (i = 0, count = posList.length; i < count; i++) {
                item = posList[i];
                pt = new Point();
                bzData.posPoints.push(pt);
                this.eachAttr(item, function (label: string, value: string): void {
                    if (label == "x") {
                        pt.x = Number(value);
                    } else if (label == "y") {
                        pt.y = Number(value);
                    }
                });
            }

            for (i = 0, count = ctrlList.length; i < count; i++) {
                item = ctrlList[i];
                pt = new Point();
                bzData.ctrlPoints.push(pt);
                this.eachAttr(item, function (label: string, value: string): void {
                    if (label == "x") {
                        pt.x = Number(value);
                    } else if (label == "y") {
                        pt.y = Number(value);
                    }
                });
            }

            return bzData;
        }

        private parseVector3D(node: Node, vector: Vector3D): Vector3D {
            if (vector == null)
                vector = new Vector3D();
            this.eachAttr(node, function (label: string, value: string): void {
                if (label == "x") {
                    vector.x = Number(value);
                } else if (label == "y") {
                    vector.y = Number(value);
                } else if (label == "z") {
                    vector.z = Number(value);
                }
            });
            return vector;
        }

        private getNode(obj:any, name: string): Node {
            if (obj == null)
                return null;
            var list: NodeList = obj.getElementsByTagName(name);
            if (list == null || list.length == null)
                return null;
            return list[0];
        }

        private getNodeList(obj: any, name: string): NodeList {
            if (obj == null)
                return null;
            var list: NodeList = obj.getElementsByTagName(name);
            if(list == null || list.length == null)
                return null;
            return list;
        }

        private eachAttr(item: Node, fun: Function): void {
            XmlParser.eachXmlAttr(item, fun);
        }

    }
}