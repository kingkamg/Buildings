import {ImageUrlType,Gender,ShareCbType} from "../SdkType";

/**用户信息 */
export class UserInfo
{

    private m_sLanguage: string;
    private m_sNickName: string;
    private m_sAvatarUrl: string;
    private m_sGender: Gender;
    private m_sCountry: string;
    private m_sProvince: string;
    private m_sCity: string;

    public constructor(info: any)
    {
        this.m_sLanguage = info.language;
        this.m_sNickName = info.nickName;
        this.m_sAvatarUrl = info.avatarUrl;
        this.m_sGender = info.gender;
        this.m_sCountry = info.country;
        this.m_sProvince = info.province;
        this.m_sCity = info.city;
    }

    public get Language(): string
    {
        return this.m_sLanguage;
    }

    public get NickName(): string
    {
        return this.m_sNickName;
    }

    public get AvatarUrl(): string
    {
        return this.m_sAvatarUrl;
    }

    public get Gender(): Gender
    {
        return this.m_sGender;
    }

    public get Country(): string
    {
        return this.m_sCountry;
    }

    public get Province(): string
    {
        return this.m_sProvince;
    }

    public get City(): string
    {
        return this.m_sCity;
    }

    public LoadAvatar(callback: Function): void
    {
        let sUrl: string = this.AvatarUrl;
        cc.loader.load(sUrl + "?aa=aa.jpg",callback);
    }

    public static LoadAvatar(sUrl: string,callback: Function): void
    {
        cc.loader.load(sUrl + "?aa=aa.jpg",callback);
    }

    // public static MakeAvatorURL(avatorSize: AvatorIconSize): string
    // {
    //     let sResult: string;
    //     return sResult;
    // }
}

export class LoginMsg
{
    public m_sCode: string;
}

export class LaunchQuery
{
    private stQuery: any;
    public SetQuery(query: any): void
    {
        this.stQuery = query;
    }
    public HasKey(key: string): boolean
    {
        if(cc.sys.platform != cc.sys.WECHAT_GAME)
        {
            return false;
        }
        return typeof (this.stQuery[key]) != "undefined";
    }
    public GetValue(key: string): string
    {
        return this.stQuery[key];
    }
}

/**分享的信息内容 */
export class ShareAppMsg
{
    /**键值对 */
    private m_mapQueryKV: Map<string,string>;
    /**题目 */
    private m_sTitle: string;
    /**url类型 */
    private m_eImageUrlType: ImageUrlType;
    /**url */
    private m_sImageUrl: string;
    public constructor()
    {
        this.m_eImageUrlType = ImageUrlType.LOCAL;
        this.m_mapQueryKV = new Map<string,string>();
    }
    public get Title(): string
    {
        return this.m_sTitle;
    }
    public set Title(title: string)
    {
        this.m_sTitle = title;
    }
    public SetImageUrlType(type: ImageUrlType): void
    {
        this.m_eImageUrlType = type;
    }
    public set ImageUrl(imgUrl: string)
    {
        this.m_sImageUrl = imgUrl;
    }
    public get ImageUrl(): string
    {
        if(!this.m_sImageUrl)
        {
            return null;
        }
        return this.m_eImageUrlType + this.m_sImageUrl;
    }
    public SetQueryKV(key: string,value: string): void
    {
        this.m_mapQueryKV.set(key,value);
    }
    public DeleteQueryKey(key: string): void
    {
        this.m_mapQueryKV.delete(key);
    }
    /**拼接字符串 格式   keyA=valA&keyB=valB */
    public get Query(): string
    {
        let sKeyValue: string = "";
        this.m_mapQueryKV.forEach(function(value,key)
        {
            if(sKeyValue != "")
            {
                sKeyValue += "&";
            }
            sKeyValue += (key + "=" + value);
        })
        if(sKeyValue == "")
        {
            return null;
        }
        return sKeyValue;
    }
}

export class ShareCbMsg
{
    /**分享回调的类型 */
    public eCallbackType: ShareCbType;
    public sShareTickets: Array<string>;
}
export class CanvasConfig
{
    /** 新建画布的width */
    public m_iCanvasWidth: number;
    /** 新建画布的height */
    public m_iCanvasHeight: number;
    /** 背景图片的URL */
    public m_sBGImgurl: String;
    /** 标题颜色 */
    public m_sTitleStyle: string;
    /** 标题大小和字体 如“50px 'red'” */
    public m_sTitleFont: string;
    /** 标题内容 */
    public m_sTitleText: string;
    /** 标题起点x坐标 */
    public m_iTitleX: number;
    /** 标题地点y坐标 */
    public m_iTitleY: number;
    /** 分数颜色 */
    public m_sScoreStyle: string;
    /** 分数大小和字体，同上 */
    public m_sScoreFont: string;
    /** 分数内容 */
    public m_sScoreText: string;
    /** 分数起点x坐标 */
    public m_iScoreX: number;
    /** 分数起点y坐标 */
    public m_iScoreY: number;

    public constructor()
    {
        this.m_iCanvasWidth = 500;
        this.m_iCanvasHeight = 400;

        this.m_iTitleX = 250;
        this.m_iTitleY = 100;
        this.m_iScoreX = 250;
        this.m_iScoreY = 200;

        this.m_sTitleFont = "30px Arial";
        this.m_sScoreFont = "30px Arial";
        this.m_sTitleStyle = "#FFFFFF";
        this.m_sScoreStyle = "#FFFFFF";
    }
}


/**排行榜的配置信息，分数、昵称、排名都与头像对齐 */
export class RankConfig
{
    //位置类配置 

    /**排行数字的X轴起点，Y轴与头像对齐，负数则不显示*/
    public m_iRankNumberBeginX: number = 50;
    /**玩家昵称的X轴起点，Y轴与头像对齐*/
    public m_iNicknameBeginX: number = 250;
    /**分数显示的X轴起点，Y轴与头像对齐 */
    public m_iScoreBeginX: number = 500;
    /**头像的X轴起点 */
    public m_iAvatarBeginX: number = 120;
    /**头像的Y轴起点 */
    public m_iAvatarBeginY: number = 500;
    /**每个玩家之间的间隔 */
    public m_iAvatarInterval: number = 90;


    //尺寸类配置

    /**头像的宽 */
    public m_iAvatarWidth: number = 64;
    /**头像的高 */
    public m_iAvatarheight: number = 64;
    /**排行数字的大小 */
    public m_iRankNumSize: number = 40;
    /**昵称的大小 */
    public m_iNicknameSize: number = 40;
    /**分数的大小 */
    public m_iScoreSize: number = 40;


    //颜色相关

    /**排行数字的颜色 */
    public m_sRankNumColor: string = "#FFFFFF";
    /**昵称的颜色 */
    public m_sNicknameColor: string = "#FFFFFF";
    /**分数的颜色 */
    public m_sScoreColor: string = "#FFFFFF";

    //其它

    /**最长显示的玩家昵称长度 */
    public m_iNicknameMaxLength: number = 6;
    /**每次渲染的最多人数 */
    public m_iMaxNum: number = 10;
    /**排行榜关键数据对应的key名字 */
    public m_sScoreKeyName: string = "score";

    //批量设置方法

    /**设置所有字体的大小 */
    public set TextSize(textSize: number)
    {
        this.m_iNicknameSize = textSize;
        this.m_iRankNumSize = textSize;
        this.m_iScoreSize = textSize;
    }

    /**设置所有字体的颜色 */
    public set TextColor(sColor: string)
    {
        this.m_sRankNumColor = sColor;
        this.m_sNicknameColor = sColor;
        this.m_sScoreColor = sColor;
    }
}

/**上传至腾讯云的数据结构体 */
export class KVData
{
    public key: string;
    public value: string;
    public constructor(sKey: string,sValue: string)
    {
        this.key = sKey;
        this.value = sValue;
    }
}