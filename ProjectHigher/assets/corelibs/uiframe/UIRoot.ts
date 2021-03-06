import CoreConfig from "../CoreConfig";

/**
 * UI总结点
 */
export default class UIRoot extends cc.Node
{
    private m_stNormalNode: cc.Node;
    private m_stFixedNode: cc.Node;
    private m_stPopUpNode: cc.Node;

    private m_stMaskNode: cc.Node;

    constructor()
    {
        super();
        this.Init();
    }

    private Init(): void
    {
        cc.game.addPersistRootNode(this);
        this.addChild(this.m_stNormalNode = new cc.Node());
        this.addChild(this.m_stFixedNode = new cc.Node());
        this.addChild(this.m_stPopUpNode = new cc.Node());

        // 添加mask
        this.m_stPopUpNode.addChild(this.m_stMaskNode = new cc.Node());
        this.m_stMaskNode.addComponent(cc.BlockInputEvents);
        this.m_stMaskNode.width = CoreConfig.GAME_WIDTH;
        this.m_stMaskNode.height = CoreConfig.GAME_HEIGHT;
        this.m_stMaskNode.setLocalZOrder(9999);
        this.m_stMaskNode.active = false;

        this.x = CoreConfig.GAME_WIDTH / 2;
        this.y = CoreConfig.GAME_HEIGHT / 2;

        this.position = cc.find('Canvas').position; // add 

        this.name = "UIRoot";
        this.m_stNormalNode.name = "Normal";
        this.m_stFixedNode.name = "Fixed";
        this.m_stPopUpNode.name = "PopUp";
        this.m_stMaskNode.name = "Mask";
    }

    public ShowMask(): void
    {
        this.m_stMaskNode.active = true;
    }

    public HideMask(): void
    {
        this.m_stMaskNode.active = false;
    }

    public get Normal(): cc.Node {return this.m_stNormalNode;}
    public get Fixed(): cc.Node {return this.m_stFixedNode;}
    public get PopUp(): cc.Node {return this.m_stPopUpNode;}
}
