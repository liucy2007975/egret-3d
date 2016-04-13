﻿module egret3d {

    /**
     * @private
     * @language zh_CN
     * @class egret3d.AnimaNodeCollection
     * @classdesc
     * 动画功能节点收集器
     * 动画功能的收集，整理，初始化容器，一般在粒子系统里使用
     * @version Egret 3.0
     * @platform Web,Native
     * @includeExample animation/AnimaNodeCollection.ts
     */
    export class AnimaNodeCollection {

        /**
        * @language zh_CN
        * 动画节点容器
        * @priavte 
        */
        public nodes: Array<AnimationNode> = new Array<AnimationNode>();

        public enableBillboardX: boolean = true;

        public enableBillboardY: boolean = true;

        public enableBillboardZ: boolean = true;

        /**
        * @language zh_CN
        * 顶点数
        * @priavte 
        */
        public numberOfVertices: number;

        /**
        * @language zh_CN
        * 顶点字节大小
        * @priavte 
        */
        public vertexSizeInBytes: number;
        
        /**
        * @language zh_CN
        * @priavte 
        */
        private _nodeData: Float32Array;

        /**
        * @language zh_CN
        * @priavte 
        */
        private _vertexAttributes: Object = {};

        /**
        * @language zh_CN
        * 构造函数
        * @priavte 
        */
        constructor() {
            this.nodes = new Array<AnimationNode>();
        }

        /**
        * @language zh_CN
        * 添加动画功能节点
        * 添加继承 animNodeBase 功能节点 例如粒子的 加速度功能节点，匀速功能节点
        * @param node 节点对象
        */
        public addNode(node: AnimationNode) {
            this.nodes.push(node);
        }

        /**
        * @language zh_CN
        * 移除动画功能节点
        * 删除指定的动画功能节点，但是不能动态删除，需要进行 功能重置
        * @param node 节点对象
        */
        public removeNode(node: AnimationNode) {
            var index: number = this.nodes.indexOf(node);
            if (index != -1)
                this.nodes.splice(index, 1);
        }

        /**
        * @language zh_CN
        * 获取节点容器
        * 获取整体的功能节点列表
        * @return 节点容器
        */
        public getNodes(): Array<AnimationNode> {
            return this.nodes;
        }

        /**
        * @language zh_CN
        * 计算节点
        * @private 
        */
        public calculate() {
            var offset: number = Geometry.positionSize + Geometry.normalSize + Geometry.uvSize;
            for (var i: number = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].attributeLenght > 0) {
                    this.nodes[i].offset = offset;
                    this.nodes[i].attributeOffsetBytes = offset * Float32Array.BYTES_PER_ELEMENT;
                    offset += this.nodes[i].attributeLenght;
                }
            }

            this.numberOfVertices = offset;
            this.vertexSizeInBytes = offset * Float32Array.BYTES_PER_ELEMENT;
        }
    }
}