import type { Attribute, Schema } from '@strapi/strapi';

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Attribute.String;
    registrationToken: Attribute.String & Attribute.Private;
    resetPasswordToken: Attribute.String & Attribute.Private;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    username: Attribute.String;
  };
}

export interface ApiContactContact extends Schema.CollectionType {
  collectionName: 'contacts';
  info: {
    description: '';
    displayName: 'form-contactus';
    pluralName: 'contacts';
    singularName: 'contact';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::contact.contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Email: Attribute.Email;
    Message: Attribute.Text;
    Name: Attribute.String;
    Phone: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::contact.contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentAboutCollaboratorContentAboutCollaborator
  extends Schema.CollectionType {
  collectionName: 'content_about_collaborators';
  info: {
    description: '';
    displayName: 'content-about-collaborators';
    name: 'CONTENT_About_Collaborators';
    pluralName: 'content-about-collaborators';
    singularName: 'content-about-collaborator';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    Contributor_Type: Attribute.Enumeration<
      [
        'StudentCollaborators',
        'EducatorCollaborators',
        'ContentResearchAssistants',
        'ContentInterns',
        'DevUXInterns',
        'InauguralTeam',
        'SteeringCommittee',
        'InternalAdvisoryCommittee',
        'ExternalAdvisoryCommittee',
        'DonorGrantingAgencies',
        'EditorialBoardFellows',
        'EditorialBoardLeads',
        'InauguralAdvisoryCommittees'
      ]
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-about-collaborator.content-about-collaborator',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Description: Attribute.Text;
    FirstName: Attribute.String;
    LastName: Attribute.String;
    ProfilePicture: Attribute.Media<'images' | 'files' | 'videos'>;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-about-collaborator.content-about-collaborator',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Years: Attribute.String;
  };
}

export interface ApiContentAboutProjectLeadContentAboutProjectLead
  extends Schema.CollectionType {
  collectionName: 'content_about_project_leads';
  info: {
    description: '';
    displayName: 'content-about-project-leads';
    name: 'CONTENT_About_Project_Leads';
    pluralName: 'content-about-project-leads';
    singularName: 'content-about-project-lead';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-about-project-lead.content-about-project-lead',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Description: Attribute.Text;
    Illustration: Attribute.Media<'images' | 'files' | 'videos'>;
    Illustration_hover: Attribute.Media<'images' | 'files' | 'videos'>;
    Name: Attribute.String;
    Order: Attribute.BigInteger;
    ProfilePicture: Attribute.Media<'images' | 'files' | 'videos'>;
    publishedAt: Attribute.DateTime;
    Role: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-about-project-lead.content-about-project-lead',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentAboutContentAbout extends Schema.SingleType {
  collectionName: 'content_abouts';
  info: {
    description: '';
    displayName: 'content-about';
    name: 'Content_About';
    pluralName: 'content-abouts';
    singularName: 'content-about';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    aboutDocuments_aplink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_cblink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_collectionsGuide: Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    aboutDocuments_ddlink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_eclink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_edlink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_fmlink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_frlink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_tblink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_tdlink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutTimeline_1: Attribute.Text;
    aboutTimeline_2: Attribute.Text;
    aboutTimeline_3: Attribute.Text;
    aboutTimeline_4: Attribute.Text;
    aboutTimeline_5: Attribute.Text;
    Banner_text: Attribute.RichText;
    BannerImage_Credit: Attribute.String;
    BannerImageCredit_more: Attribute.String;
    BehindTheScenes_Video1: Attribute.String;
    BehindTheScenes_Video2: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-about.content-about',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-about.content-about',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentDiscoverStoriesMainContentDiscoverStoriesMain
  extends Schema.SingleType {
  collectionName: 'content_discover_stories_mains';
  info: {
    description: '';
    displayName: 'content-discover-stories-main';
    name: 'Content_DiscoverStoriesMain';
    pluralName: 'content-discover-stories-mains';
    singularName: 'content-discover-stories-main';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    BannerImageCredit: Attribute.String;
    BannerImageCredit_more: Attribute.String;
    BannerText: Attribute.RichText;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-discover-stories-main.content-discover-stories-main',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    IntroductionText: Attribute.RichText;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-discover-stories-main.content-discover-stories-main',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentDiscoverStoryContentDiscoverStory
  extends Schema.CollectionType {
  collectionName: 'content_discover_stories';
  info: {
    description: '';
    displayName: 'content-discover-story';
    name: 'CONTENT_Discover_Story';
    pluralName: 'content-discover-stories';
    singularName: 'content-discover-story';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    AvalonTitle: Attribute.String;
    AvalonUrl: Attribute.String;
    bigquote1: Attribute.RichText;
    bigquote2: Attribute.RichText;
    career: Attribute.Component<'general.career', true>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-discover-story.content-discover-story',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    dob: Attribute.String;
    featured: Attribute.Enumeration<['true', 'false']>;
    firstname: Attribute.String;
    imgcaption: Attribute.String;
    lastname: Attribute.String;
    maintext: Attribute.RichText;
    name: Attribute.String;
    profilepic: Attribute.Media<'images' | 'files' | 'videos'>;
    publishedAt: Attribute.DateTime;
    role: Attribute.String;
    rolesAtNwc: Attribute.Component<'general.role', true>;
    sources: Attribute.Component<'general.source', true>;
    state: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-discover-story.content-discover-story',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    usertags: Attribute.Component<'general.usertags', true>;
    VideoUrl: Attribute.String;
  };
}

export interface ApiContentEssayContentEssay extends Schema.CollectionType {
  collectionName: 'content_essays';
  info: {
    description: '';
    displayName: 'content-essay';
    name: 'CONTENT_Essay';
    pluralName: 'content-essays';
    singularName: 'content-essay';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    AuthorCredit: Attribute.RichText;
    BigImage1: Attribute.Component<'essays.captioned-image'>;
    BigImage2: Attribute.Component<'essays.captioned-image'>;
    CaptionedImage1: Attribute.Component<'essays.captioned-image'>;
    CaptionedImage2: Attribute.Component<'essays.captioned-image'>;
    CaptionedImage3: Attribute.Component<'essays.captioned-image'>;
    CaptionedImage4: Attribute.Component<'essays.captioned-image'>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-essay.content-essay',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Featured: Attribute.Boolean;
    HeaderImage: Attribute.Component<'essays.captioned-image'>;
    LayoutChoice: Attribute.Enumeration<
      ['Layout1', 'Layout2', 'Layout3', 'TorchRelay']
    >;
    PreferredCitation: Attribute.String;
    publishedAt: Attribute.DateTime;
    PullQuote1: Attribute.String;
    PullQuote2: Attribute.String;
    Section1: Attribute.Component<'essays.section'>;
    Section2: Attribute.Component<'essays.section'>;
    Section3: Attribute.Component<'essays.section'>;
    Section4: Attribute.Component<'essays.section'>;
    ShortTitle: Attribute.String;
    Sources: Attribute.Component<'general.source', true>;
    Thumbnail: Attribute.Media<'files' | 'images' | 'videos'> &
      Attribute.Required;
    TimeLineURL: Attribute.String;
    Title: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-essay.content-essay',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    VideoAudioComponent: Attribute.Component<'general.video-audio'>;
  };
}

export interface ApiContentFooterContentFooter extends Schema.SingleType {
  collectionName: 'content_footers';
  info: {
    description: '';
    displayName: 'content-footer';
    name: 'Content_Footer';
    pluralName: 'content-footers';
    singularName: 'content-footer';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-footer.content-footer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    DonateLink: Attribute.String;
    FacebookLink: Attribute.String;
    InstagramLink: Attribute.String;
    paragraph: Attribute.String;
    publishedAt: Attribute.DateTime;
    TwitterLink: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-footer.content-footer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentHomeHighlightContentHomeHighlight
  extends Schema.CollectionType {
  collectionName: 'content_home_highlights';
  info: {
    description: '';
    displayName: 'content-home-highlight';
    pluralName: 'content-home-highlights';
    singularName: 'content-home-highlight';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-home-highlight.content-home-highlight',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Featured: Attribute.Boolean;
    home_highlights_link: Attribute.String;
    publishedAt: Attribute.DateTime;
    ShortTitle: Attribute.String;
    Thumbnail: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-home-highlight.content-home-highlight',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentHomeMapContentHomeMap extends Schema.CollectionType {
  collectionName: 'content_home_maps';
  info: {
    description: '';
    displayName: 'content-home-map';
    name: 'CONTENT_Home_MapPoint';
    pluralName: 'content-home-maps';
    singularName: 'content-home-map';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    citation1: Attribute.String;
    citation2: Attribute.String;
    citation3: Attribute.String;
    citation4: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-home-map.content-home-map',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Description: Attribute.RichText;
    img1: Attribute.Media<'images' | 'files' | 'videos'>;
    img2: Attribute.Media<'images' | 'files' | 'videos'>;
    img3: Attribute.Media<'images' | 'files' | 'videos'>;
    img4: Attribute.Media<'images' | 'files' | 'videos'>;
    mainImage: Attribute.Media<'images' | 'files' | 'videos'>;
    Map: Attribute.Enumeration<
      [
        'downtown',
        'thirdward_uh',
        'museum_district',
        'magnolia_park',
        'astrodome'
      ]
    >;
    Name: Attribute.String;
    pdf1: Attribute.Media<'images' | 'files' | 'videos'>;
    pdf2: Attribute.Media<'images' | 'files' | 'videos'>;
    pdf3: Attribute.Media<'images' | 'files' | 'videos'>;
    pdf4: Attribute.Media<'images' | 'files' | 'videos'>;
    publishedAt: Attribute.DateTime;
    sources: Attribute.Component<'general.sources', true>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-home-map.content-home-map',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    x: Attribute.Decimal;
    y: Attribute.Decimal;
  };
}

export interface ApiContentHomeContentHome extends Schema.SingleType {
  collectionName: 'content_homes';
  info: {
    description: '';
    displayName: 'content-home';
    name: 'Content_Homes';
    pluralName: 'content-homes';
    singularName: 'content-home';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    aboutImgCredit: Attribute.String;
    aboutImgCredit_more: Attribute.Text;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-home.content-home',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    homeAbout_p: Attribute.RichText;
    homeButton1_link: Attribute.String;
    homeButton1_text: Attribute.Text;
    homeButton2_link: Attribute.String;
    homeButton2_text: Attribute.Text;
    homeButton3_link: Attribute.String;
    homeButton3_text: Attribute.Text;
    homeButton4_link: Attribute.String;
    homeButton4_text: Attribute.Text;
    homeExplore_text: Attribute.RichText;
    homeMap_text: Attribute.RichText;
    PhotoByExplore: Attribute.String;
    PhotoByExplore_more: Attribute.Text;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-home.content-home',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentHowToContributeResourceContentHowToContributeResource
  extends Schema.CollectionType {
  collectionName: 'content_how_to_contribute_resources';
  info: {
    description: '';
    displayName: 'content-how-to-contribute-resource';
    pluralName: 'content-how-to-contribute-resources';
    singularName: 'content-how-to-contribute-resource';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    banner_text: Attribute.RichText;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-how-to-contribute-resource.content-how-to-contribute-resource',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    files: Attribute.Component<'general.files', true>;
    publishedAt: Attribute.DateTime;
    resource: Attribute.String & Attribute.Required & Attribute.Unique;
    resource_icon: Attribute.Media<'images'>;
    summary_text: Attribute.RichText;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-how-to-contribute-resource.content-how-to-contribute-resource',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    video_url: Attribute.String & Attribute.Required;
  };
}

export interface ApiContentHowToContributeContentHowToContribute
  extends Schema.SingleType {
  collectionName: 'content_how_to_contributes';
  info: {
    description: '';
    displayName: 'content-how-to-contribute';
    name: 'Content_HowToContribute';
    pluralName: 'content-how-to-contributes';
    singularName: 'content-how-to-contribute';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    ArchivistsText: Attribute.RichText;
    BannerImageCredit: Attribute.String;
    BannerImageCredit_more: Attribute.String;
    BannerText: Attribute.RichText;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-how-to-contribute.content-how-to-contribute',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    EducatorsText: Attribute.RichText;
    NwcParticipantsText: Attribute.RichText;
    publishedAt: Attribute.DateTime;
    ResearchersText: Attribute.RichText;
    StudentsText: Attribute.RichText;
    SubmissionsText: Attribute.RichText;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-how-to-contribute.content-how-to-contribute',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentMappingNwcContentMappingNwc
  extends Schema.SingleType {
  collectionName: 'content_mapping_nwcs';
  info: {
    description: '';
    displayName: 'content-mapping-nwc';
    name: 'Content_MappingNWC';
    pluralName: 'content-mapping-nwcs';
    singularName: 'content-mapping-nwc';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    AdvancedSearch_Banner: Attribute.RichText;
    AdvancedSearch_Education: Attribute.RichText;
    AdvancedSearch_HowTo: Attribute.RichText;
    AdvancedSearch_NWC: Attribute.RichText;
    AdvancedSearch_OpenSearch: Attribute.RichText;
    AdvancedSearch_Organizations: Attribute.RichText;
    AdvancedSearch_Participants: Attribute.RichText;
    AdvancedSearch_Politics: Attribute.RichText;
    Banner_text: Attribute.RichText;
    BannerImage_Credit: Attribute.String;
    BannerImageCredit_more: Attribute.String;
    BasicSearch_Progress_Map: Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    BasicSearch_Text: Attribute.RichText;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-mapping-nwc.content-mapping-nwc',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    DigDeeperImage_Credit: Attribute.String;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-mapping-nwc.content-mapping-nwc',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentOralHistoryContentOralHistory
  extends Schema.SingleType {
  collectionName: 'content_oral_histories';
  info: {
    description: '';
    displayName: 'Content-oral-histories';
    pluralName: 'content-oral-histories';
    singularName: 'content-oral-history';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    BannerImage_Credit: Attribute.String;
    BannerImageCredit_more: Attribute.String;
    BannerText: Attribute.RichText;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-oral-history.content-oral-history',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ExploreText: Attribute.RichText;
    NWC_Means_VideoURL: Attribute.String;
    publishedAt: Attribute.DateTime;
    Reflections_VideoURL1: Attribute.String;
    Reflections_VideoURL2: Attribute.String;
    ReflectionsText: Attribute.RichText;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-oral-history.content-oral-history',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    What_NWC_Means: Attribute.RichText;
  };
}

export interface ApiContentToolkitContentToolkit extends Schema.SingleType {
  collectionName: 'content_toolkits';
  info: {
    description: '';
    displayName: 'content-toolkits';
    name: 'Content_Toolkits';
    pluralName: 'content-toolkits';
    singularName: 'content-toolkit';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-toolkit.content-toolkit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Pdf_Classroom_Ideas: Attribute.Media<'files'>;
    Pdf_How_to_Contribute_Biographies_Educators: Attribute.Media<'files'>;
    Pdf_How_to_Contribute_Biographies_NWCParticipants: Attribute.Media<'files'>;
    Pdf_How_to_Contribute_Biographies_Students_Researchers: Attribute.Media<'files'>;
    Pdf_How_to_Contribute_Oral_Histories_Educators: Attribute.Media<'files'>;
    Pdf_How_to_Contribute_Oral_Histories_NWCParticipants: Attribute.Media<'files'>;
    Pdf_How_to_Contribute_Oral_Histories_Students_Researchers: Attribute.Media<'files'>;
    Pdf_How_to_Donate_Your_Papers: Attribute.Media<'files'>;
    Pdf_Permission_Documents: Attribute.Media<'files'>;
    Pdf_Technical_Guidelines: Attribute.Media<'files'>;
    Pdf_Technical_Guidelines_Archivists: Attribute.Media<'files'>;
    publishedAt: Attribute.DateTime;
    Resources_for_Archivists_Text: Attribute.RichText;
    Resources_for_Educators_Text: Attribute.RichText;
    Resources_for_Participants_Text: Attribute.RichText;
    Resources_for_Researchers_Text: Attribute.RichText;
    Resources_for_Students_Text: Attribute.RichText;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-toolkit.content-toolkit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Video_Url_Archivists: Attribute.String;
    Video_Url_Educators: Attribute.String;
    Video_Url_Participants: Attribute.String;
    Video_Url_Researchers: Attribute.String;
    Video_Url_Students: Attribute.String;
  };
}

export interface ApiContentWhyTheNwcMatterContentWhyTheNwcMatter
  extends Schema.SingleType {
  collectionName: 'content_why_the_nwc_matters';
  info: {
    description: '';
    displayName: 'content-why-the-nwc-matters';
    name: 'Content_WhyTheNWCMatters';
    pluralName: 'content-why-the-nwc-matters';
    singularName: 'content-why-the-nwc-matter';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    BannerPhotoCredit: Attribute.String;
    BannerPhotoCredit_more: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-why-the-nwc-matter.content-why-the-nwc-matter',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    HistoricalOverview: Attribute.RichText;
    PrimaryDocuments: Attribute.Component<'general.primary-documents', true>;
    publishedAt: Attribute.DateTime;
    TimelineIframeSrc: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-why-the-nwc-matter.content-why-the-nwc-matter',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    VideoTitle: Attribute.String;
    VideoURL: Attribute.String;
  };
}

export interface ApiDataBasicRaceDataBasicRace extends Schema.CollectionType {
  collectionName: 'data_basic_races';
  info: {
    description: '';
    displayName: 'data-basic-race';
    pluralName: 'data-basic-races';
    singularName: 'data-basic-race';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-basic-race.data-basic-race',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    participants: Attribute.Relation<
      'api::data-basic-race.data-basic-race',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    race: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-basic-race.data-basic-race',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataCareerDataCareer extends Schema.CollectionType {
  collectionName: 'data_careers';
  info: {
    description: '';
    displayName: 'data-career';
    pluralName: 'data-careers';
    singularName: 'data-career';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    category_of_employment: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-career.data-career',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    job_profession: Attribute.Text;
    participant: Attribute.Relation<
      'api::data-career.data-career',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-career.data-career',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataEducationDataEducation extends Schema.CollectionType {
  collectionName: 'data_educations';
  info: {
    description: '';
    displayName: 'data-education';
    pluralName: 'data-educations';
    singularName: 'data-education';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-education.data-education',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    degree: Attribute.String;
    institution: Attribute.String;
    participant: Attribute.Relation<
      'api::data-education.data-education',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-education.data-education',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    year: Attribute.BigInteger;
  };
}

export interface ApiDataIdcMasterDataIdcMaster extends Schema.CollectionType {
  collectionName: 'data_idc_masters';
  info: {
    description: '';
    displayName: 'data-idc-master';
    pluralName: 'data-idc-masters';
    singularName: 'data-idc-master';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-idc-master.data-idc-master',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    first_name: Attribute.String;
    last_name: Attribute.String;
    middle_name_initial_1: Attribute.String;
    middle_name_initial_2: Attribute.String;
    nick_name: Attribute.String;
    participant_category: Attribute.Enumeration<
      ['Ford', 'Carter', 'Ford_Carter']
    >;
    publishedAt: Attribute.DateTime;
    represented_state: Attribute.Enumeration<
      [
        'AK',
        'AL',
        'AR',
        'AS',
        'AZ',
        'CA',
        'CO',
        'CT',
        'DC',
        'DE',
        'FL',
        'GA',
        'GU',
        'HI',
        'IA',
        'ID',
        'IL',
        'IN',
        'KS',
        'KY',
        'LA',
        'MA',
        'MD',
        'ME',
        'MI',
        'MN',
        'MO',
        'MS',
        'MT',
        'NC',
        'ND',
        'NE',
        'NH',
        'NJ',
        'NM',
        'NV',
        'NY',
        'OH',
        'OK',
        'OR',
        'PA',
        'PR',
        'RI',
        'SC',
        'SD',
        'TN',
        'TT',
        'TX',
        'UT',
        'VA',
        'VI',
        'VT',
        'WA',
        'WI',
        'WV',
        'WY'
      ]
    >;
    suffix: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-idc-master.data-idc-master',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataLeadershipInOrganizationDataLeadershipInOrganization
  extends Schema.CollectionType {
  collectionName: 'data_leadership_in_organizations';
  info: {
    description: '';
    displayName: 'data-leadership-in-organization';
    pluralName: 'data-leadership-in-organizations';
    singularName: 'data-leadership-in-organization';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-leadership-in-organization.data-leadership-in-organization',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    organization: Attribute.String;
    participant: Attribute.Relation<
      'api::data-leadership-in-organization.data-leadership-in-organization',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    role: Attribute.String;
    specific_role: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-leadership-in-organization.data-leadership-in-organization',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataOrganizationalPoliticalDataOrganizationalPolitical
  extends Schema.CollectionType {
  collectionName: 'data_organizational_politicals';
  info: {
    description: '';
    displayName: 'data-organizational-political';
    pluralName: 'data-organizational-politicals';
    singularName: 'data-organizational-political';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-organizational-political.data-organizational-political',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    organizational_and_political: Attribute.String;
    participants: Attribute.Relation<
      'api::data-organizational-political.data-organizational-political',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-organizational-political.data-organizational-political',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataPlankDataPlank extends Schema.CollectionType {
  collectionName: 'data_planks';
  info: {
    description: '';
    displayName: 'data-plank';
    pluralName: 'data-planks';
    singularName: 'data-plank';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-plank.data-plank',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    participants_against: Attribute.Relation<
      'api::data-plank.data-plank',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    participants_for: Attribute.Relation<
      'api::data-plank.data-plank',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    participants_no_known_position: Attribute.Relation<
      'api::data-plank.data-plank',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    participants_spoke_for: Attribute.Relation<
      'api::data-plank.data-plank',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    plank: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-plank.data-plank',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataPoliticalOfficeHeldDataPoliticalOfficeHeld
  extends Schema.CollectionType {
  collectionName: 'data_political_office_helds';
  info: {
    description: '';
    displayName: 'data-political-office-held';
    pluralName: 'data-political-office-helds';
    singularName: 'data-political-office-held';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-political-office-held.data-political-office-held',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    end_year: Attribute.BigInteger;
    jurisdiction: Attribute.String;
    participant: Attribute.Relation<
      'api::data-political-office-held.data-political-office-held',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    political_office: Attribute.String;
    present: Attribute.Boolean;
    start_year: Attribute.BigInteger;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-political-office-held.data-political-office-held',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataPoliticalOfficeLostDataPoliticalOfficeLost
  extends Schema.CollectionType {
  collectionName: 'data_political_office_losts';
  info: {
    description: '';
    displayName: 'data-political-office-lost';
    pluralName: 'data-political-office-losts';
    singularName: 'data-political-office-lost';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-political-office-lost.data-political-office-lost',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    jurisdiction: Attribute.String;
    participant: Attribute.Relation<
      'api::data-political-office-lost.data-political-office-lost',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    political_office: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-political-office-lost.data-political-office-lost',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    year: Attribute.BigInteger;
  };
}

export interface ApiDataPoliticalPartyDataPoliticalParty
  extends Schema.CollectionType {
  collectionName: 'data_political_parties';
  info: {
    description: '';
    displayName: 'data-political-party';
    pluralName: 'data-political-parties';
    singularName: 'data-political-party';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-political-party.data-political-party',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    participant: Attribute.Relation<
      'api::data-political-party.data-political-party',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    party: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-political-party.data-political-party',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataRaceDataRace extends Schema.CollectionType {
  collectionName: 'data_races';
  info: {
    description: '';
    displayName: 'data-race';
    pluralName: 'data-races';
    singularName: 'data-race';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-race.data-race',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    participants: Attribute.Relation<
      'api::data-race.data-race',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    race: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-race.data-race',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataResidenceIn1977DataResidenceIn1977
  extends Schema.CollectionType {
  collectionName: 'data_residence_in_1977s';
  info: {
    description: '';
    displayName: 'data-residence-in-1977';
    pluralName: 'data-residence-in-1977s';
    singularName: 'data-residence-in-1977';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    city_state: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-residence-in-1977.data-residence-in-1977',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    median_household_income: Attribute.BigInteger;
    participant: Attribute.Relation<
      'api::data-residence-in-1977.data-residence-in-1977',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    po_box_rural_route: Attribute.String;
    street_address: Attribute.String;
    total_population: Attribute.BigInteger;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-residence-in-1977.data-residence-in-1977',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    zip_code: Attribute.String;
  };
}

export interface ApiDataRoleDataRole extends Schema.CollectionType {
  collectionName: 'data_roles';
  info: {
    description: '';
    displayName: 'data-role';
    pluralName: 'data-roles';
    singularName: 'data-role';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-role.data-role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    oralhistory_role_toggle: Attribute.Boolean & Attribute.DefaultTo<false>;
    participants: Attribute.Relation<
      'api::data-role.data-role',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    role: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-role.data-role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataSpouseDataSpouse extends Schema.CollectionType {
  collectionName: 'data_spouses';
  info: {
    description: '';
    displayName: 'data-spouse';
    pluralName: 'data-spouses';
    singularName: 'data-spouse';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-spouse.data-spouse',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    first_name: Attribute.String;
    last_name: Attribute.String;
    middle_name_initial_1: Attribute.String;
    middle_name_initial_2: Attribute.String;
    nickname: Attribute.String;
    participant: Attribute.Relation<
      'api::data-spouse.data-spouse',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    political_offices: Attribute.Text;
    professions: Attribute.Text;
    suffix: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::data-spouse.data-spouse',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEmailTemplateEmailTemplate extends Schema.CollectionType {
  collectionName: 'email_templates';
  info: {
    description: '';
    displayName: 'email-template';
    pluralName: 'email-templates';
    singularName: 'email-template';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bcc: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::email-template.email-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    subject: Attribute.String & Attribute.Required;
    template: Attribute.String & Attribute.Required;
    text: Attribute.Text & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::email-template.email-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFormDonatepaperFormDonatepaper
  extends Schema.CollectionType {
  collectionName: 'form_donatepapers';
  info: {
    description: '';
    displayName: 'form-donatepaper';
    pluralName: 'form-donatepapers';
    singularName: 'form-donatepaper';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Attribute.Text;
    comments: Attribute.Text;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::form-donatepaper.form-donatepaper',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email;
    name: Attribute.String;
    phone: Attribute.String;
    role_at_nwc: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::form-donatepaper.form-donatepaper',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFormInquiryarchivistFormInquiryarchivist
  extends Schema.CollectionType {
  collectionName: 'form_inquiryarchivists';
  info: {
    description: '';
    displayName: 'form-inquiryarchivist';
    pluralName: 'form-inquiryarchivists';
    singularName: 'form-inquiryarchivist';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    affiliation: Attribute.String;
    archives: Attribute.Text;
    collections: Attribute.Text;
    corrections: Attribute.Text;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::form-inquiryarchivist.form-inquiryarchivist',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email;
    name: Attribute.String;
    oralHistory: Attribute.Text;
    story: Attribute.Text;
    title: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::form-inquiryarchivist.form-inquiryarchivist',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFormInquiryeducatorFormInquiryeducator
  extends Schema.CollectionType {
  collectionName: 'form_inquiryeducators';
  info: {
    description: '';
    displayName: 'form-inquiryeducator';
    pluralName: 'form-inquiryeducators';
    singularName: 'form-inquiryeducator';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    affiliation: Attribute.String;
    classes: Attribute.Text;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::form-inquiryeducator.form-inquiryeducator',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email;
    guidance: Attribute.Text;
    more: Attribute.Text;
    name: Attribute.String;
    students: Attribute.Text;
    title: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::form-inquiryeducator.form-inquiryeducator',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFormInquiryparticipantFormInquiryparticipant
  extends Schema.CollectionType {
  collectionName: 'form_inquiryparticipants';
  info: {
    description: '';
    displayName: 'form-inquiryparticipant';
    pluralName: 'form-inquiryparticipants';
    singularName: 'form-inquiryparticipant';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::form-inquiryparticipant.form-inquiryparticipant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email;
    experience: Attribute.Text;
    interview: Attribute.Text;
    involved: Attribute.Text;
    memorabilia: Attribute.Text;
    more: Attribute.Text;
    name: Attribute.String;
    phone: Attribute.String;
    role_at_nwc: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::form-inquiryparticipant.form-inquiryparticipant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFormInquiryresearcherFormInquiryresearcher
  extends Schema.CollectionType {
  collectionName: 'form_inquiryresearchers';
  info: {
    description: '';
    displayName: 'form-inquiryresearcher';
    pluralName: 'form-inquiryresearchers';
    singularName: 'form-inquiryresearcher';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    affiliation: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::form-inquiryresearcher.form-inquiryresearcher',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email;
    guidance: Attribute.Text;
    interest: Attribute.Text;
    name: Attribute.String;
    projects: Attribute.Text;
    title: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::form-inquiryresearcher.form-inquiryresearcher',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFormInquirystudentFormInquirystudent
  extends Schema.CollectionType {
  collectionName: 'form_inquirystudents';
  info: {
    description: '';
    displayName: 'form-inquirystudent';
    pluralName: 'form-inquirystudents';
    singularName: 'form-inquirystudent';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::form-inquirystudent.form-inquirystudent',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email;
    how: Attribute.Text;
    name: Attribute.String;
    school: Attribute.String;
    skills: Attribute.Text;
    time: Attribute.Text;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::form-inquirystudent.form-inquirystudent',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    why: Attribute.Text;
    year: Attribute.String;
  };
}

export interface ApiFormMoreideaFormMoreidea extends Schema.CollectionType {
  collectionName: 'form_moreideas';
  info: {
    description: '';
    displayName: 'form-moreideas';
    pluralName: 'form-moreideas';
    singularName: 'form-moreidea';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Address: Attribute.String;
    Affiliation: Attribute.String;
    Comments: Attribute.Text;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::form-moreidea.form-moreidea',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Email: Attribute.Email;
    Name: Attribute.String;
    Phone: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::form-moreidea.form-moreidea',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFormForm extends Schema.CollectionType {
  collectionName: 'forms';
  info: {
    description: '';
    displayName: 'form-corrections';
    name: 'Forms';
    pluralName: 'forms';
    singularName: 'form';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Affiliation: Attribute.String;
    Corrections: Attribute.Text;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::form.form', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    Email: Attribute.String;
    Feature: Attribute.String;
    Name: Attribute.String;
    Page: Attribute.String;
    Source: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::form.form', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiListOfCommissionerListOfCommissioner
  extends Schema.CollectionType {
  collectionName: 'list_of_commissioners';
  info: {
    description: '';
    displayName: 'list-of-commissioners';
    name: 'List_of_Commissioner';
    pluralName: 'list-of-commissioners';
    singularName: 'list-of-commissioner';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    Commissioner: Attribute.Enumeration<
      [
        'Carter National Commissioner',
        'Ford National Commissioner',
        'Ford National Commissioner, Carter National Commissioner'
      ]
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::list-of-commissioner.list-of-commissioner',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    FirstName: Attribute.String;
    LastName: Attribute.String;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::list-of-commissioner.list-of-commissioner',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiListOfParticipantListOfParticipant
  extends Schema.CollectionType {
  collectionName: 'list_of_participants';
  info: {
    description: '';
    displayName: 'list-of-participants';
    name: 'List_of_Participants';
    pluralName: 'list-of-participants';
    singularName: 'list-of-participant';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::list-of-participant.list-of-participant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    FirstName: Attribute.String;
    LastName: Attribute.String;
    publishedAt: Attribute.DateTime;
    States: Attribute.Enumeration<
      [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'NewHampshire',
        'NewJersey',
        'NewMexico',
        'NewYork',
        'NorthCarolina',
        'NorthDakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'RhodeIsland',
        'SouthCarolina',
        'SouthDakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'WestVirginia',
        'Wisconsin',
        'Wyoming'
      ]
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::list-of-participant.list-of-participant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNwcParticipantNwcParticipant extends Schema.CollectionType {
  collectionName: 'nwc_participants';
  info: {
    description: '';
    displayName: 'data-participant';
    pluralName: 'nwc-participants';
    singularName: 'nwc-participant';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    age_in_1977: Attribute.Integer;
    age_range: Attribute.String;
    basic_races: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-basic-race.data-basic-race'
    >;
    birth_ca: Attribute.Boolean;
    birth_day: Attribute.Integer &
      Attribute.SetMinMax<
        {
          max: 31;
          min: 1;
        },
        number
      >;
    birth_month: Attribute.Integer &
      Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      >;
    birth_year: Attribute.Integer;
    careers: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToMany',
      'api::data-career.data-career'
    >;
    city_level_commission: Attribute.Boolean;
    county_level_commission: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    death_day: Attribute.Integer &
      Attribute.SetMinMax<
        {
          max: 31;
          min: 1;
        },
        number
      >;
    death_month: Attribute.Integer &
      Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      >;
    death_year: Attribute.Integer;
    educations: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToMany',
      'api::data-education.data-education'
    >;
    federal_level_commission: Attribute.Boolean;
    first_name: Attribute.String;
    gender: Attribute.String;
    has_children: Attribute.Boolean;
    high_school: Attribute.String;
    highest_level_of_education_attained: Attribute.String;
    income_level: Attribute.String;
    income_level_dollar_amount: Attribute.Decimal;
    last_name: Attribute.String;
    lat: Attribute.Float;
    leadership_in_organizations: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToMany',
      'api::data-leadership-in-organization.data-leadership-in-organization'
    >;
    lon: Attribute.Float;
    marital_classification: Attribute.String;
    middle_name_initial_1: Attribute.String;
    middle_name_initial_2: Attribute.String;
    military_service: Attribute.Boolean;
    national_advisory_committee: Attribute.Boolean;
    nickname: Attribute.String;
    organizational_politicals: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-organizational-political.data-organizational-political'
    >;
    place_of_birth: Attribute.String;
    planks_against: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-plank.data-plank'
    >;
    planks_fors: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-plank.data-plank'
    >;
    planks_no_known_position: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-plank.data-plank'
    >;
    planks_spoke_fors: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-plank.data-plank'
    >;
    political_office_helds: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToMany',
      'api::data-political-office-held.data-political-office-held'
    >;
    political_office_losts: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToMany',
      'api::data-political-office-lost.data-political-office-lost'
    >;
    political_parties: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToMany',
      'api::data-political-party.data-political-party'
    >;
    races: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-race.data-race'
    >;
    religion: Attribute.String;
    represented_state: Attribute.String;
    residence_in_1977s: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToMany',
      'api::data-residence-in-1977.data-residence-in-1977'
    >;
    roles: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-role.data-role'
    >;
    self_identified_feminist: Attribute.Boolean;
    sexual_orientation: Attribute.String;
    spouses: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToMany',
      'api::data-spouse.data-spouse'
    >;
    state_level_commission: Attribute.Boolean;
    suffix: Attribute.String;
    total_number_of_children: Attribute.Integer;
    union_member: Attribute.Boolean;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    votes_received_at_state_meeting_for_nwc_delegate_alternate: Attribute.BigInteger;
  };
}

export interface ApiParticipantParticipant extends Schema.CollectionType {
  collectionName: 'participants';
  info: {
    description: '';
    displayName: 'old_participant';
    pluralName: 'participants';
    singularName: 'participant';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    age_in_1977: Attribute.Integer;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::participant.participant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    edc: Attribute.JSON;
    first_name: Attribute.String;
    gender: Attribute.String;
    highest_level_education: Attribute.Enumeration<
      [
        'some_high_school',
        'high_school_diploma',
        'some_degree',
        'college_degree',
        'graduate_professional_degree',
        'unknown'
      ]
    >;
    import_note: Attribute.Text;
    last_name: Attribute.String;
    leadership: Attribute.JSON;
    location_of_residence_in1977: Attribute.JSON;
    marital_classification: Attribute.String;
    median_household_income_of_place_of_residence: Attribute.Integer;
    name_of_spouse: Attribute.String;
    orgs: Attribute.JSON;
    participant_id: Attribute.String;
    place_of_birth: Attribute.String;
    poli: Attribute.JSON;
    publishedAt: Attribute.DateTime;
    race: Attribute.JSON;
    religion: Attribute.Enumeration<
      [
        'agnostic',
        'atheist',
        'catholic',
        'christian',
        'eastern',
        'jewish',
        'mormon',
        'muslim',
        'unknown',
        'none'
      ]
    >;
    residence_in_1977: Attribute.String;
    sexual_orientation: Attribute.String;
    state: Attribute.String;
    total_number_of_children: Attribute.Integer;
    total_population_of_place_of_residence: Attribute.Integer;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::participant.participant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    timezone: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    isEntryValid: Attribute.Boolean;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Attribute.String;
    caption: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ext: Attribute.String;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    height: Attribute.Integer;
    mime: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    size: Attribute.Decimal & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    url: Attribute.String & Attribute.Required;
    width: Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    type: Attribute.String & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    resetPasswordToken: Attribute.String & Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::contact.contact': ApiContactContact;
      'api::content-about-collaborator.content-about-collaborator': ApiContentAboutCollaboratorContentAboutCollaborator;
      'api::content-about-project-lead.content-about-project-lead': ApiContentAboutProjectLeadContentAboutProjectLead;
      'api::content-about.content-about': ApiContentAboutContentAbout;
      'api::content-discover-stories-main.content-discover-stories-main': ApiContentDiscoverStoriesMainContentDiscoverStoriesMain;
      'api::content-discover-story.content-discover-story': ApiContentDiscoverStoryContentDiscoverStory;
      'api::content-essay.content-essay': ApiContentEssayContentEssay;
      'api::content-footer.content-footer': ApiContentFooterContentFooter;
      'api::content-home-highlight.content-home-highlight': ApiContentHomeHighlightContentHomeHighlight;
      'api::content-home-map.content-home-map': ApiContentHomeMapContentHomeMap;
      'api::content-home.content-home': ApiContentHomeContentHome;
      'api::content-how-to-contribute-resource.content-how-to-contribute-resource': ApiContentHowToContributeResourceContentHowToContributeResource;
      'api::content-how-to-contribute.content-how-to-contribute': ApiContentHowToContributeContentHowToContribute;
      'api::content-mapping-nwc.content-mapping-nwc': ApiContentMappingNwcContentMappingNwc;
      'api::content-oral-history.content-oral-history': ApiContentOralHistoryContentOralHistory;
      'api::content-toolkit.content-toolkit': ApiContentToolkitContentToolkit;
      'api::content-why-the-nwc-matter.content-why-the-nwc-matter': ApiContentWhyTheNwcMatterContentWhyTheNwcMatter;
      'api::data-basic-race.data-basic-race': ApiDataBasicRaceDataBasicRace;
      'api::data-career.data-career': ApiDataCareerDataCareer;
      'api::data-education.data-education': ApiDataEducationDataEducation;
      'api::data-idc-master.data-idc-master': ApiDataIdcMasterDataIdcMaster;
      'api::data-leadership-in-organization.data-leadership-in-organization': ApiDataLeadershipInOrganizationDataLeadershipInOrganization;
      'api::data-organizational-political.data-organizational-political': ApiDataOrganizationalPoliticalDataOrganizationalPolitical;
      'api::data-plank.data-plank': ApiDataPlankDataPlank;
      'api::data-political-office-held.data-political-office-held': ApiDataPoliticalOfficeHeldDataPoliticalOfficeHeld;
      'api::data-political-office-lost.data-political-office-lost': ApiDataPoliticalOfficeLostDataPoliticalOfficeLost;
      'api::data-political-party.data-political-party': ApiDataPoliticalPartyDataPoliticalParty;
      'api::data-race.data-race': ApiDataRaceDataRace;
      'api::data-residence-in-1977.data-residence-in-1977': ApiDataResidenceIn1977DataResidenceIn1977;
      'api::data-role.data-role': ApiDataRoleDataRole;
      'api::data-spouse.data-spouse': ApiDataSpouseDataSpouse;
      'api::email-template.email-template': ApiEmailTemplateEmailTemplate;
      'api::form-donatepaper.form-donatepaper': ApiFormDonatepaperFormDonatepaper;
      'api::form-inquiryarchivist.form-inquiryarchivist': ApiFormInquiryarchivistFormInquiryarchivist;
      'api::form-inquiryeducator.form-inquiryeducator': ApiFormInquiryeducatorFormInquiryeducator;
      'api::form-inquiryparticipant.form-inquiryparticipant': ApiFormInquiryparticipantFormInquiryparticipant;
      'api::form-inquiryresearcher.form-inquiryresearcher': ApiFormInquiryresearcherFormInquiryresearcher;
      'api::form-inquirystudent.form-inquirystudent': ApiFormInquirystudentFormInquirystudent;
      'api::form-moreidea.form-moreidea': ApiFormMoreideaFormMoreidea;
      'api::form.form': ApiFormForm;
      'api::list-of-commissioner.list-of-commissioner': ApiListOfCommissionerListOfCommissioner;
      'api::list-of-participant.list-of-participant': ApiListOfParticipantListOfParticipant;
      'api::nwc-participant.nwc-participant': ApiNwcParticipantNwcParticipant;
      'api::participant.participant': ApiParticipantParticipant;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
