module egret3d {

    /**
    * @private
    * @language zh_CN
    * @class egret3d.IQuadNode
    * @classdesc
    * 四叉树中一个节点的接口
    * @version Egret 3.0
    * @platform Web,Native
    */
    export interface IQuadNode {

        /**
        * @language zh_CN
        * 初始化包围盒
        * @version Egret 3.0
        * @platform Web,Native
        */
        initAABB(): void;

        /**
        * @language zh_CN
        * 是否该节点是三角形
        * @version Egret 3.0
        * @platform Web,Native
        */
        isTriangle: boolean;

        /**
        * @language zh_CN
        * 包围盒引用
        * @version Egret 3.0
        * @platform Web,Native
        */
        aabb: QuadAABB;

        /**
        * @language zh_CN
        * 计算全局的quadtree的数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        calcGlobalQuadAABB(): void;

        /**
        * @language zh_CN
        * 如果这个对象只是普通的一个三角面，才有可能存在这个对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        plane?: Plane3D;

    }
}
