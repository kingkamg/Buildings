import {ResStruct} from "../../corelibs/util/ResourcesMgr";
import {BattleManager} from "../manager/BattleManager";
import {ConfigData} from "../common/ConfigData";
import Core from "../../corelibs/Core";
import {BrickCell} from "./BrickCell";
import {CameraRollType,GameEventType} from "../common/GameEnum";
import {BrickState} from "../common/GameEnum";
import {PlayerData} from "../common/PlayerData";
import {ResType} from "../../corelibs/CoreDefine";
import {PerfectMgr} from "../battle/PerfectMgr";

/**
 * 砖块类
 * @author zhouyulong
 * 2018年5月24日 14:34:42
 */
export class Brick
{
    /**钩子资源 */
    private readonly Brick_RES: string = "prefabs/brick";
    /**完美资源 */
    private readonly PERFECT_EFFECT_RES: string = "prefabs/PerfectEffect";
    /**砖块资源列表*/
    private brickResList: Array<cc.Node>;
    /**完美特效资源 */
    private perfectRes: cc.Node;
    /**砖块列表 */
    private brickList: Array<BrickCell>;
    /** 人口动画列表 */
    private brickAniList: Array<BrickCell>;
    /** 大楼初始x轴 */
    private m_iBuildingOriginX: number;
    /** 大楼当前倾斜角度 */
    private m_iCurrentInclination: number = 0;
    /** 大楼高度 */
    private m_iBuildingHeight: number;

    /**是否下落中 */
    public isFalling: boolean;
    /**当前的砖块 */
    private currentBrick: BrickCell;
    /**当前下落到高度*/
    private currentFallY: number;
    /**完美列表 */
    private perfectList: Array<BrickCell>;
    /** 计时器 */
    private perfectMgr: PerfectMgr;


    constructor()
    {
        this.brickResList = new Array<cc.Node>();
        this.brickList = new Array<BrickCell>();
        this.brickAniList = new Array<BrickCell>();
        this.perfectList = new Array<BrickCell>();
    }

    public init(): void
    {
        let hookRes: Array<ResStruct> = BattleManager.getInstance().arrResData;
        for(let a: number = 0;a < ConfigData.BRICK_COUNT;a++)
        {
            for(let b: number = 0;b < hookRes.length;b++)
            {
                if(hookRes[b].m_sUrl == this.Brick_RES + (a + 1))//砖块资源
                {
                    this.brickResList.push((Core.ResourcesMgr.getRes(hookRes[b].m_iResType,hookRes[b].m_sUrl) as cc.Prefab).data);
                    break;
                }
                else if(hookRes[b].m_sUrl == this.PERFECT_EFFECT_RES)//完美特效资源
                {
                    this.perfectRes = (Core.ResourcesMgr.getRes(hookRes[b].m_iResType,hookRes[b].m_sUrl) as cc.Prefab).data;
                }
            }
        }
    }

    /**
     * 开始游戏
     */
    public startGame(): void
    {
        this.isFalling = false;
        this.currentFallY = ConfigData.INIT_FLOOR_Y;
        this.addBrick(1000,-300);
    }
    public endGame(): void
    {
        for(let i = 0;i < this.brickList.length;i++)
        {
            let brick: BrickCell = this.brickList[i];
            brick.res.removeFromParent();
        }
        this.currentBrick.res.removeFromParent();
    }

    /**
     * 投放砖块
     */
    public putBrick(): void
    {
        if(this.isFalling == false)
        {
            this.isFalling = true;
        }
    }

    /**
     * 帧刷新
     */
    public update(pos: cc.Vec2,rotation: number): void
    {

        if(this.brickAniList.length > 0)
        {
            let lastBrick: BrickCell = this.brickAniList[0];
            if(lastBrick.m_bShouldFly)
            {
                lastBrick.animateWithBrickPopulation();
            }
            else
            {
                this.brickAniList.shift();
            }
        }
        if(this.brickList.length > 4)//大楼开始摇晃
        {
            for(let i: number = 0;i < this.brickList.length - 1;i++)
            {
                let brick: BrickCell = this.brickList[i];
                if(i == 0)
                {
                    let brick_h = BattleManager.getInstance().GetDistance(brick.res.position,this.brickList[0].res.position);//高度
                    this.m_iCurrentInclination += ConfigData.BUILDING_SWING_SPEED;
                    this.m_iCurrentInclination %= 360;
                    brick.res.x = ConfigData.BUILDING_MAX_SWING_X * Math.sin(Math.PI * this.m_iCurrentInclination / 180.0) + brick.offset;
                }
                else 
                {
                    brick.res.x = this.brickList[i - 1].res.x + brick.offset;
                }
                // brick.res.y = brick_h * (1 - Math.cos(Math.PI * this.m_iCurrentInclination / 180.0));

            }
        }

        if(this.isFalling == true)
        {
            if(this.currentBrick != null)
            {
                let _endX: number = 0;
                if(this.brickList.length >= 2)
                {
                    let lastBrick = this.brickList[this.brickList.length - 2];
                    // console.log(">>>>>>>>>>>last: ",lastBrick.res.position);
                    // console.log("<<<<<<<<<<<current: ",this.currentBrick.res.position);
                    _endX = lastBrick.res.position.x;
                }
                this.currentBrick.update(_endX,this.currentFallY,this.endFall.bind(this));
            }
        }
        else
        {
            //brick.postion和hook.postion相距70
            let theta: number = rotation * Math.PI / 180;
            let length: number = 70;
            this.currentBrick.setPosition(pos.x - length * Math.sin(theta),pos.y - length * Math.cos(theta));
            // this.currentBrick.setRotation(rotation);
        }
    }

    /**
     * 添加砖块
     */
    public addBrick(_x: number,_y: number): void
    {
        let last = this.brickList.length > 0 ? this.brickList[this.brickList.length - 1] : null;

        let index: number = Math.floor(Math.random() * this.brickResList.length);
        this.currentBrick = new BrickCell(this.brickList.length,cc.instantiate(this.brickResList[index]),this.perfectRes);
        this.currentBrick.m_stLastBrick = last;
        this.currentBrick.init(BattleManager.getInstance().cameraCanvas);
        this.brickList.push(this.currentBrick);
        this.currentBrick.setPosition(_x,_y);
    }

    /**
     * 结束下落
     */
    private endFall(state: BrickState): void
    {
        if(this.brickList.length > 1)
        {
            this.currentBrick.offset = this.currentBrick.res.x - this.brickList[this.brickList.length - 2].res.x;
        }

        if(state == BrickState.COLLAPSE)
        {
            let brick: BrickCell = this.brickList[this.brickList.length - 2];
            this.currentBrick.m_stLastBrick = brick;
            PlayerData.population -= brick.m_iPopulation;
            if(this.brickList.length > 3)
            {
                BattleManager.getInstance().moveCameraStart(CameraRollType.DOWN);
                Core.EventMgr.Emit(GameEventType.UPDATE_HP,null);
            }
            return;
        }
        if(state == BrickState.FALLING)
        {
            this.brickList.pop();
            Core.EventMgr.Emit(GameEventType.UPDATE_HP,null);
        }
        else if(state == BrickState.CRACK)
        {
            this.brickList.pop();
            let brick: BrickCell = this.brickList.pop();
            if(brick.res.parent != null)
            {
                brick.res.removeFromParent();
            }
        }
        else
        {
            if(state == BrickState.PERFECT)//完美下落
            {
                this.brickAniList.push(this.currentBrick);
                this.perfectList.push(this.currentBrick);
                if(this.brickList.length > 1)
                {
                    for(let i: number = 0;i < this.brickList.length;i++)
                    {
                        this.brickList[i].playPerfectEffect();
                    }
                }
                Core.AudioMgr.PlaySound("score");
            }
            else if(state == BrickState.GOOD)
            {
                this.brickAniList.push(this.currentBrick);
            }
            else if(state == BrickState.NORMAL)
            {
                this.brickAniList.push(this.currentBrick);
            }
            if(this.brickList.length >= 3)
            {
                BattleManager.getInstance().moveCameraStart(CameraRollType.UP);
            }
        }

        PlayerData.floor = this.brickList.length;//减去钩子上挂着的
        Core.EventMgr.Emit(GameEventType.UPDATE_FLOOR,null);
        Core.EventMgr.Emit(GameEventType.UPDATE_POPULATION,null);

        //更新brick
        if(this.isFalling == true)
        {
            this.isFalling = false;
            this.currentFallY = ConfigData.INIT_FLOOR_Y + (this.brickList.length * ConfigData.BRICK_HEIGHT);
            this.addBrick(1000,0);
        }
    }



}