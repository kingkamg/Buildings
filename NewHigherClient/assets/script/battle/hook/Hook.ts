import {ResStruct} from "../../../corelibs/util/ResourcesMgr";
import Core from "../../../corelibs/Core";
import {BattleManager} from "../../manager/BattleManager";
import {ConfigData} from "../../common/ConfigData";
import {CameraRollType} from "../../common/GameEnum";

/**
 * 钩子类
 * @author zhouyulong
 * 2018年5月23日 20:57:53
 */
export class Hook
{
    /**钩子资源 */
    private readonly HOOK_RES: string = "prefabs/Hook";
    /**钩子主资源 */
    public mainHook: cc.Node;
    /**桥梁 */
    private qiaoLiang: cc.Node;
    /**桥梁下面横块 */
    private hengKuai: cc.Node;
    /**绳子 */
    private rope: cc.Node;
    /**钩子 */
    public hook: cc.Node;

    public m_iQiaoLiangX: number = 360;
    public m_iQiaoLiangY: number = 720;
    /** 钩子初始x坐标 */
    public m_iOriginX: number = 360;
    /** 钩子初始y坐标 */
    public m_iOriginY: number = 360;
    /** 钩子上一帧x坐标 */
    public m_iLastX: number = 0;
    /** 钩子上一帧y坐标 */
    public m_iLastY: number = 0;
    /** 钩子x坐标 */
    public m_iX: number = 360;
    /** 钩子y坐标 */
    public m_iY: number = 360;
    /**  */
    public m_iT: number = 0;
    /** 钩子移动速度 */
    public m_iSpeed: number = 2.2;
    /** 钩子摆动幅度 */
    public m_iSwingOffset: number = 180;
    /** 砖块向上弹跳幅度 */
    public m_iUp_b: number = 50;
    /** 砖块向下弹跳幅度 */
    public m_iDown_b: number = 100;

    constructor()
    {

    }

    public init(): void
    {
        let hookRes: Array<ResStruct> = BattleManager.getInstance().arrResData;
        for(let a: number = 0;a < hookRes.length;a++)
        {
            if(hookRes[a].m_sUrl == this.HOOK_RES)
            {
                this.mainHook = cc.instantiate((Core.ResourcesMgr.getRes(hookRes[a].m_iResType,hookRes[a].m_sUrl) as cc.Prefab).data);
                this.qiaoLiang = this.mainHook.getChildByName("HaningRod");
                this.hengKuai = this.mainHook.getChildByName("HaningRodPos");
                this.rope = this.mainHook.getChildByName("rope");
                this.hook = this.mainHook.getChildByName("hook2");
                break;
            }
        }
    }

    /**
     * 显示
     */
    public show(): void
    {
        this.mainHook.x = -57;
        this.mainHook.y = 580;
        BattleManager.getInstance().cameraCanvas.addChild(this.mainHook);
        this.mainHook.setLocalZOrder(1);//0 是背景
        // Core.UIRoot.PopUp.addChild(this.mainHook);
    }

    /**
     * 隐藏
     */
    public hide(): void
    {
        if(this.mainHook.parent != null)
        {
            this.mainHook.parent.removeChild(this.mainHook);
        }
    }



    //** 获取中点的位置*/
    private GetMidPostion(pos_1: cc.Vec2,pos_2: cc.Vec2): cc.Vec2
    {
        return cc.p((pos_1.x + pos_2.x) / 2,(pos_1.y + pos_2.y) / 2);
    }

    /**
     * 刷新
     */
    public update(dt: number): void
    {
        if(BattleManager.getInstance().isMoveCamera == true) 
        {
            if(BattleManager.getInstance().moveDirection == CameraRollType.UP)//镜头向上滚动
            {
                this.mainHook.y += ConfigData.CAMERA_MOVE_SPEED;
            } else if(BattleManager.getInstance().moveDirection == CameraRollType.DOWN)//镜头向下滚动
            {
                this.mainHook.y -= ConfigData.CAMERA_MOVE_SPEED;
            }
        }
        this.m_iLastY = this.m_iY;
        this.m_iT += this.m_iSpeed;
        this.m_iT %= 360;
        this.m_iX = this.m_iSwingOffset * Math.cos(Math.PI * this.m_iT / 180.0);
        if(this.m_iT <= 180)
            this.m_iY = this.m_iUp_b * Math.sin(Math.PI * this.m_iT / 180.0);
        else
        {
            this.m_iY = this.m_iDown_b * Math.sin(Math.PI * this.m_iT / 180.0);
        }

        this.m_iX = this.m_iX + this.m_iOriginX;
        this.m_iY = this.m_iY + this.m_iOriginY;

        let ro: number = Math.atan((this.m_iQiaoLiangX - this.m_iX) / (this.m_iQiaoLiangY - this.m_iY - 70));

        let RopeHeight: number = BattleManager.getInstance().GetDistance(cc.p(this.m_iX,this.m_iY + 70),cc.p(this.m_iQiaoLiangX,this.m_iQiaoLiangY)) - 22;
        if(this.rope != null)
        {
            this.rope.height = RopeHeight;
            this.rope.rotation = ro / Math.PI * 180;
        }
        if(this.hook != null)
        {
            this.hook.rotation = this.rope.rotation * 0.5;//钩子弧度只有绳子的一半
            this.hook.position = cc.p(this.m_iX - this.m_iQiaoLiangX + 57,this.m_iY - this.m_iQiaoLiangY + 25);
        }
    }
}