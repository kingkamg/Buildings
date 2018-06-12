import {ConfigData} from "../common/ConfigData";
import {BattleManager} from "../manager/BattleManager";
import {BrickFallState} from "../common/GameEnum";

/**
 * 砖块单元
 * @author zhouyulong
 * @2018年5月24日 14:51:20
 */
export class BrickCell
{
    /**播放次数 */
    private readonly PLAY_COUNT = 3;
    /**完美特效偏移量 */
    private readonly PERFECT_EFFECT_OFFSETY: number = 45;
    /**砖块层级 */
    private readonly LOCAL_ZORDER: number = 3;
    /**砖块ID 唯一标记 */
    private id: number;
    /**资源 */
    public res: cc.Node;
    /**完美动画资源 */
    private perfectEffectRes: cc.Node;
    /**父结点 */
    private parent: cc.Node;
    /** 完美特效*/
    private perfectEffect: cc.Node;
    /**当前播放次数 */
    private currentPlayCount: number;

    constructor(_id: number,_res: cc.Node,_perfectEffect: cc.Node)
    {
        this.id = _id;
        this.res = _res;
        this.perfectEffectRes = _perfectEffect.getChildByName("sp_perfectEffect");
        this.currentPlayCount = 0;
    }

    public init(_parent: cc.Node): void
    {
        this.parent = _parent;
        this.parent.addChild(this.res);
        //放在最前
        this.res.setLocalZOrder(this.LOCAL_ZORDER);
    }

    /**
     * 设置位置
     */
    public setPosition(_x: number,_y: number): void
    {
        this.res.x = _x;
        this.res.y = _y;
    }

    /**
     * 播放完美动画
     */
    public playPerfectEffect(): void
    {
        if(this.perfectEffect != null)
        {
            this.removePerfectEffect();
        }
        this.perfectEffect = cc.instantiate(this.perfectEffectRes);
        this.perfectEffect.getComponent(sp.Skeleton).setCompleteListener(this.playComplete.bind(this));
        this.parent.addChild(this.perfectEffect);
        this.perfectEffect.setLocalZOrder(this.LOCAL_ZORDER + 1);//在砖块层级之上
        this.perfectEffect.x = this.res.x;
        this.perfectEffect.y = this.res.y - this.PERFECT_EFFECT_OFFSETY;
    }

    /**
     * 帧刷新
     */
    public update(_endX: number,_endY: number,_callBack: Function): void
    {
        // console.log("brick: ",this.res);
        // console.log("==========screen frame: ",cc.view.getVisibleSize(),cc.view.getFrameSize());
        let offset: number = Math.abs(this.res.x - _endX);//掉落的楼层和底部楼层的偏差
        if(this.res.y - ConfigData.BRICK_FALL_SPEED > _endY)
        {
            this.res.y -= ConfigData.BRICK_FALL_SPEED;
        }
        else
        {
            /** 第一次掉落直接返回 */
            if(this.id == 0)
            {
                _callBack(BrickFallState.NORMAL);
                return;
            }
            if(offset > ConfigData.BRICK_WIDTH)//没有触碰到楼层跌落
            {
                this.res.y -= ConfigData.BRICK_FALL_SPEED;
                //离开屏幕后移除并返回状态
                if(this.res.y - ConfigData.BRICK_FALL_SPEED < -ConfigData.CAMERA_HEIGHT / 2 - 70)
                {
                    if(this.parent != null)
                    {
                        this.parent.removeChild(this.res);
                    }
                    _callBack(BrickFallState.FALLING);
                }
            }
            // else if(offset > 35) //触碰到楼层跌落
            // {
            //     _callBack(BrickFallState.COLLAPSE);
            // }
            else
            {
                //盖楼成功
                this.res.y = _endY;
                if(this.res.x - _endX <= ConfigData.PERFECT_OFFEST_X)
                {
                    _callBack(BrickFallState.PERFECT);//完美 结束回调
                }
                else
                {
                    _callBack(BrickFallState.NORMAL);//结束回调
                }
            }
        }
    }

    /**
     * 一次播放完成
     */
    private playComplete(): void
    {
        this.currentPlayCount++;
        if(this.currentPlayCount >= this.PLAY_COUNT)
        {
            this.removePerfectEffect();
        }
    }

    /**
     * 移除完美特效
     */
    private removePerfectEffect(): void
    {
        this.currentPlayCount = 0;
        this.perfectEffect.getComponent(sp.Skeleton).setCompleteListener(null);
        this.perfectEffect.parent.removeChild(this.perfectEffect);
        this.perfectEffect.destroy();
        this.perfectEffect = null;
    }
}