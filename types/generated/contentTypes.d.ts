import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
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
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
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
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
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
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
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
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
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
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
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
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
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
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
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
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
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
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
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
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
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
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
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
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    isEntryValid: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
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
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
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
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
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
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
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
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContactContact extends Schema.CollectionType {
  collectionName: 'contacts';
  info: {
    singularName: 'contact';
    pluralName: 'contacts';
    displayName: 'form-contactus';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Name: Attribute.String;
    Email: Attribute.Email;
    Phone: Attribute.String;
    Message: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::contact.contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::contact.contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentAboutContentAbout extends Schema.SingleType {
  collectionName: 'content_abouts';
  info: {
    singularName: 'content-about';
    pluralName: 'content-abouts';
    displayName: 'content-about';
    name: 'Content_About';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    Banner_text: Attribute.RichText;
    BannerImage_Credit: Attribute.String;
    BannerImageCredit_more: Attribute.String;
    aboutDocuments_aplink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_ddlink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_cblink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_frlink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_eclink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_fmlink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_tblink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_tdlink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutDocuments_edlink: Attribute.Media<'images' | 'files' | 'videos'>;
    aboutTimeline_1: Attribute.Text;
    aboutTimeline_2: Attribute.Text;
    aboutTimeline_3: Attribute.Text;
    aboutTimeline_4: Attribute.Text;
    aboutTimeline_5: Attribute.Text;
    aboutDocuments_collectionsGuide: Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-about.content-about',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-about.content-about',
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
    singularName: 'content-about-collaborator';
    pluralName: 'content-about-collaborators';
    displayName: 'content-about-collaborators';
    name: 'CONTENT_About_Collaborators';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
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
        'DonorGrantingAgencies'
      ]
    >;
    FirstName: Attribute.String;
    LastName: Attribute.String;
    Years: Attribute.String;
    Description: Attribute.Text;
    ProfilePicture: Attribute.Media<'images' | 'files' | 'videos'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-about-collaborator.content-about-collaborator',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-about-collaborator.content-about-collaborator',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentAboutProjectLeadContentAboutProjectLead
  extends Schema.CollectionType {
  collectionName: 'content_about_project_leads';
  info: {
    singularName: 'content-about-project-lead';
    pluralName: 'content-about-project-leads';
    displayName: 'content-about-project-leads';
    name: 'CONTENT_About_Project_Leads';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    Name: Attribute.String;
    Role: Attribute.String;
    Description: Attribute.Text;
    Illustration: Attribute.Media<'images' | 'files' | 'videos'>;
    ProfilePicture: Attribute.Media<'images' | 'files' | 'videos'>;
    Illustration_hover: Attribute.Media<'images' | 'files' | 'videos'>;
    Order: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-about-project-lead.content-about-project-lead',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-about-project-lead.content-about-project-lead',
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
    singularName: 'content-discover-stories-main';
    pluralName: 'content-discover-stories-mains';
    displayName: 'content-discover-stories-main';
    name: 'Content_DiscoverStoriesMain';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    BannerText: Attribute.RichText;
    BannerImageCredit: Attribute.String;
    BannerImageCredit_more: Attribute.String;
    IntroductionText: Attribute.RichText;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-discover-stories-main.content-discover-stories-main',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'content-discover-story';
    pluralName: 'content-discover-stories';
    displayName: 'content-discover-story';
    name: 'CONTENT_Discover_Story';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    role: Attribute.String;
    state: Attribute.String;
    profilepic: Attribute.Media<'images' | 'files' | 'videos'>;
    dob: Attribute.String;
    career: Attribute.Component<'general.career', true>;
    rolesAtNwc: Attribute.Component<'general.role', true>;
    usertags: Attribute.Component<'general.usertags', true>;
    bigquote1: Attribute.RichText;
    bigquote2: Attribute.RichText;
    maintext: Attribute.RichText;
    sources: Attribute.Component<'general.source', true>;
    featured: Attribute.Enumeration<['true', 'false']>;
    imgcaption: Attribute.String;
    AvalonUrl: Attribute.String;
    AvalonTitle: Attribute.String;
    VideoUrl: Attribute.String;
    firstname: Attribute.String;
    lastname: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-discover-story.content-discover-story',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-discover-story.content-discover-story',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentEssayContentEssay extends Schema.CollectionType {
  collectionName: 'content_essays';
  info: {
    singularName: 'content-essay';
    pluralName: 'content-essays';
    displayName: 'content-essay';
    name: 'CONTENT_Essay';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    LayoutChoice: Attribute.Enumeration<
      ['Layout1', 'Layout2', 'Layout3', 'TorchRelay']
    >;
    Featured: Attribute.Boolean;
    Title: Attribute.String;
    ShortTitle: Attribute.String;
    Thumbnail: Attribute.Media<'files' | 'images' | 'videos'> &
      Attribute.Required;
    HeaderImage: Attribute.Component<'essays.captioned-image'>;
    CaptionedImage1: Attribute.Component<'essays.captioned-image'>;
    CaptionedImage2: Attribute.Component<'essays.captioned-image'>;
    CaptionedImage3: Attribute.Component<'essays.captioned-image'>;
    CaptionedImage4: Attribute.Component<'essays.captioned-image'>;
    Section1: Attribute.Component<'essays.section'>;
    Section2: Attribute.Component<'essays.section'>;
    Section3: Attribute.Component<'essays.section'>;
    Section4: Attribute.Component<'essays.section'>;
    PullQuote1: Attribute.String;
    PullQuote2: Attribute.String;
    AuthorCredit: Attribute.RichText;
    Sources: Attribute.Component<'general.source', true>;
    PreferredCitation: Attribute.String;
    VideoAudioComponent: Attribute.Component<'general.video-audio'>;
    BigImage1: Attribute.Component<'essays.captioned-image'>;
    BigImage2: Attribute.Component<'essays.captioned-image'>;
    TimeLineURL: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-essay.content-essay',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-essay.content-essay',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentFooterContentFooter extends Schema.SingleType {
  collectionName: 'content_footers';
  info: {
    singularName: 'content-footer';
    pluralName: 'content-footers';
    displayName: 'content-footer';
    name: 'Content_Footer';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    TwitterLink: Attribute.String;
    InstagramLink: Attribute.String;
    FacebookLink: Attribute.String;
    DonateLink: Attribute.String;
    paragraph: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-footer.content-footer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-footer.content-footer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentHomeContentHome extends Schema.SingleType {
  collectionName: 'content_homes';
  info: {
    singularName: 'content-home';
    pluralName: 'content-homes';
    displayName: 'content-home';
    name: 'Content_Homes';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    PhotoByExplore: Attribute.String;
    PhotoByExplore_more: Attribute.Text;
    aboutImgCredit: Attribute.String;
    aboutImgCredit_more: Attribute.Text;
    homeAbout_p: Attribute.RichText;
    homeAbout_p1: Attribute.RichText;
    homeAbout_p2: Attribute.RichText;
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
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-home.content-home',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-home.content-home',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentHomeCarouselContentHomeCarousel
  extends Schema.CollectionType {
  collectionName: 'content_home_carousels';
  info: {
    singularName: 'content-home-carousel';
    pluralName: 'content-home-carousels';
    displayName: 'content-home-carousel';
    name: 'CONTENT_Home_Carousel_Imgs';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    Section: Attribute.String;
    Image: Attribute.Media<'images' | 'files' | 'videos'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-home-carousel.content-home-carousel',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-home-carousel.content-home-carousel',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentHomeMapContentHomeMap extends Schema.CollectionType {
  collectionName: 'content_home_maps';
  info: {
    singularName: 'content-home-map';
    pluralName: 'content-home-maps';
    displayName: 'content-home-map';
    name: 'CONTENT_Home_MapPoint';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
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
    x: Attribute.Decimal;
    y: Attribute.Decimal;
    Description: Attribute.RichText;
    mainImage: Attribute.Media<'images' | 'files' | 'videos'>;
    pdf1: Attribute.Media<'images' | 'files' | 'videos'>;
    pdf2: Attribute.Media<'images' | 'files' | 'videos'>;
    pdf3: Attribute.Media<'images' | 'files' | 'videos'>;
    pdf4: Attribute.Media<'images' | 'files' | 'videos'>;
    img1: Attribute.Media<'images' | 'files' | 'videos'>;
    img2: Attribute.Media<'images' | 'files' | 'videos'>;
    img3: Attribute.Media<'images' | 'files' | 'videos'>;
    img4: Attribute.Media<'images' | 'files' | 'videos'>;
    citation1: Attribute.String;
    citation2: Attribute.String;
    citation3: Attribute.String;
    citation4: Attribute.String;
    sources: Attribute.Component<'general.sources', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-home-map.content-home-map',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-home-map.content-home-map',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentHowToContributeContentHowToContribute
  extends Schema.SingleType {
  collectionName: 'content_how_to_contributes';
  info: {
    singularName: 'content-how-to-contribute';
    pluralName: 'content-how-to-contributes';
    displayName: 'content-how-to-contribute';
    name: 'Content_HowToContribute';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    BannerText: Attribute.RichText;
    BannerImageCredit: Attribute.String;
    BannerImageCredit_more: Attribute.String;
    ResearchersText: Attribute.RichText;
    NwcParticipantsText: Attribute.RichText;
    EducatorsText: Attribute.RichText;
    StudentsText: Attribute.RichText;
    SubmissionsText: Attribute.RichText;
    ArchivistsText: Attribute.RichText;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-how-to-contribute.content-how-to-contribute',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-how-to-contribute.content-how-to-contribute',
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
    singularName: 'content-how-to-contribute-resource';
    pluralName: 'content-how-to-contribute-resources';
    displayName: 'content-how-to-contribute-resource';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    resource: Attribute.String & Attribute.Required & Attribute.Unique;
    resource_icon: Attribute.Media<'images'>;
    summary_text: Attribute.RichText;
    banner_text: Attribute.RichText;
    video_url: Attribute.String & Attribute.Required;
    files: Attribute.Component<'general.files', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-how-to-contribute-resource.content-how-to-contribute-resource',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-how-to-contribute-resource.content-how-to-contribute-resource',
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
    singularName: 'content-mapping-nwc';
    pluralName: 'content-mapping-nwcs';
    displayName: 'content-mapping-nwc';
    name: 'Content_MappingNWC';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Banner_text: Attribute.RichText;
    BannerImage_Credit: Attribute.String;
    BannerImageCredit_more: Attribute.String;
    BasicSearch_Text: Attribute.RichText;
    AdvancedSearch_Banner: Attribute.RichText;
    AdvancedSearch_HowTo: Attribute.RichText;
    AdvancedSearch_OpenSearch: Attribute.RichText;
    AdvancedSearch_NWC: Attribute.RichText;
    AdvancedSearch_Participants: Attribute.RichText;
    AdvancedSearch_Education: Attribute.RichText;
    AdvancedSearch_Politics: Attribute.RichText;
    AdvancedSearch_Organizations: Attribute.RichText;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-mapping-nwc.content-mapping-nwc',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'content-oral-history';
    pluralName: 'content-oral-histories';
    displayName: 'Content-oral-histories';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    BannerText: Attribute.RichText;
    BannerImage_Credit: Attribute.String;
    BannerImageCredit_more: Attribute.String;
    What_NWC_Means: Attribute.RichText;
    ExploreText: Attribute.RichText;
    NWC_Means_VideoURL: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-oral-history.content-oral-history',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-oral-history.content-oral-history',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentToolkitContentToolkit extends Schema.SingleType {
  collectionName: 'content_toolkits';
  info: {
    singularName: 'content-toolkit';
    pluralName: 'content-toolkits';
    displayName: 'content-toolkits';
    name: 'Content_Toolkits';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    Resources_for_Students_Text: Attribute.RichText;
    Resources_for_Researchers_Text: Attribute.RichText;
    Resources_for_Participants_Text: Attribute.RichText;
    Resources_for_Archivists_Text: Attribute.RichText;
    Resources_for_Educators_Text: Attribute.RichText;
    Video_Url_Students: Attribute.String;
    Video_Url_Researchers: Attribute.String;
    Video_Url_Participants: Attribute.String;
    Video_Url_Archivists: Attribute.String;
    Video_Url_Educators: Attribute.String;
    Pdf_How_to_Contribute_Oral_Histories_Students_Researchers: Attribute.Media<'files'>;
    Pdf_How_to_Contribute_Oral_Histories_Educators: Attribute.Media<'files'>;
    Pdf_How_to_Contribute_Oral_Histories_NWCParticipants: Attribute.Media<'files'>;
    Pdf_How_to_Contribute_Biographies_Students_Researchers: Attribute.Media<'files'>;
    Pdf_How_to_Contribute_Biographies_Educators: Attribute.Media<'files'>;
    Pdf_How_to_Contribute_Biographies_NWCParticipants: Attribute.Media<'files'>;
    Pdf_Technical_Guidelines: Attribute.Media<'files'>;
    Pdf_Technical_Guidelines_Archivists: Attribute.Media<'files'>;
    Pdf_Permission_Documents: Attribute.Media<'files'>;
    Pdf_How_to_Donate_Your_Papers: Attribute.Media<'files'>;
    Pdf_Classroom_Ideas: Attribute.Media<'files'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-toolkit.content-toolkit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-toolkit.content-toolkit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentWhyTheNwcMatterContentWhyTheNwcMatter
  extends Schema.SingleType {
  collectionName: 'content_why_the_nwc_matters';
  info: {
    singularName: 'content-why-the-nwc-matter';
    pluralName: 'content-why-the-nwc-matters';
    displayName: 'content-why-the-nwc-matters';
    name: 'Content_WhyTheNWCMatters';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    HistoricalOverview: Attribute.RichText;
    BannerPhotoCredit: Attribute.String;
    BannerPhotoCredit_more: Attribute.String;
    PrimaryDocuments: Attribute.Component<'general.primary-documents', true>;
    TimelineIframeSrc: Attribute.String;
    VideoTitle: Attribute.String;
    VideoURL: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-why-the-nwc-matter.content-why-the-nwc-matter',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-why-the-nwc-matter.content-why-the-nwc-matter',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataBasicRaceDataBasicRace extends Schema.CollectionType {
  collectionName: 'data_basic_races';
  info: {
    singularName: 'data-basic-race';
    pluralName: 'data-basic-races';
    displayName: 'data-basic-race';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    race: Attribute.String;
    participants: Attribute.Relation<
      'api::data-basic-race.data-basic-race',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-basic-race.data-basic-race',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'data-career';
    pluralName: 'data-careers';
    displayName: 'data-career';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    category_of_employment: Attribute.String;
    job_profession: Attribute.Text;
    participant: Attribute.Relation<
      'api::data-career.data-career',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-career.data-career',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'data-education';
    pluralName: 'data-educations';
    displayName: 'data-education';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    degree: Attribute.String;
    institution: Attribute.String;
    year: Attribute.BigInteger;
    participant: Attribute.Relation<
      'api::data-education.data-education',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-education.data-education',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::data-education.data-education',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataIdcMasterDataIdcMaster extends Schema.CollectionType {
  collectionName: 'data_idc_masters';
  info: {
    singularName: 'data-idc-master';
    pluralName: 'data-idc-masters';
    displayName: 'data-idc-master';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    last_name: Attribute.String;
    first_name: Attribute.String;
    middle_name_initial_1: Attribute.String;
    middle_name_initial_2: Attribute.String;
    nick_name: Attribute.String;
    suffix: Attribute.String;
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
    participant_category: Attribute.Enumeration<
      ['Ford', 'Carter', 'Ford_Carter']
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-idc-master.data-idc-master',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'data-leadership-in-organization';
    pluralName: 'data-leadership-in-organizations';
    displayName: 'data-leadership-in-organization';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    role: Attribute.String;
    specific_role: Attribute.String;
    organization: Attribute.String;
    participant: Attribute.Relation<
      'api::data-leadership-in-organization.data-leadership-in-organization',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-leadership-in-organization.data-leadership-in-organization',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'data-organizational-political';
    pluralName: 'data-organizational-politicals';
    displayName: 'data-organizational-political';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    organizational_and_political: Attribute.String;
    participants: Attribute.Relation<
      'api::data-organizational-political.data-organizational-political',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-organizational-political.data-organizational-political',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'data-plank';
    pluralName: 'data-planks';
    displayName: 'data-plank';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    plank: Attribute.String;
    participants_for: Attribute.Relation<
      'api::data-plank.data-plank',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    participants_against: Attribute.Relation<
      'api::data-plank.data-plank',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    participants_spoke_for: Attribute.Relation<
      'api::data-plank.data-plank',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-plank.data-plank',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'data-political-office-held';
    pluralName: 'data-political-office-helds';
    displayName: 'data-political-office-held';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    jurisdiction: Attribute.String;
    political_office: Attribute.String;
    start_year: Attribute.BigInteger;
    end_year: Attribute.BigInteger;
    present: Attribute.Boolean;
    participant: Attribute.Relation<
      'api::data-political-office-held.data-political-office-held',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-political-office-held.data-political-office-held',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'data-political-office-lost';
    pluralName: 'data-political-office-losts';
    displayName: 'data-political-office-lost';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    jurisdiction: Attribute.String;
    political_office: Attribute.String;
    year: Attribute.BigInteger;
    participant: Attribute.Relation<
      'api::data-political-office-lost.data-political-office-lost',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-political-office-lost.data-political-office-lost',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::data-political-office-lost.data-political-office-lost',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataPoliticalPartyDataPoliticalParty
  extends Schema.CollectionType {
  collectionName: 'data_political_parties';
  info: {
    singularName: 'data-political-party';
    pluralName: 'data-political-parties';
    displayName: 'data-political-party';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    party: Attribute.String;
    participant: Attribute.Relation<
      'api::data-political-party.data-political-party',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-political-party.data-political-party',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'data-race';
    pluralName: 'data-races';
    displayName: 'data-race';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    race: Attribute.String;
    participants: Attribute.Relation<
      'api::data-race.data-race',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-race.data-race',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'data-residence-in-1977';
    pluralName: 'data-residence-in-1977s';
    displayName: 'data-residence-in-1977';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    street_address: Attribute.String;
    po_box_rural_route: Attribute.String;
    city_state: Attribute.String;
    zip_code: Attribute.String;
    total_population: Attribute.BigInteger;
    median_household_income: Attribute.BigInteger;
    participant: Attribute.Relation<
      'api::data-residence-in-1977.data-residence-in-1977',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-residence-in-1977.data-residence-in-1977',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::data-residence-in-1977.data-residence-in-1977',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataRoleDataRole extends Schema.CollectionType {
  collectionName: 'data_roles';
  info: {
    singularName: 'data-role';
    pluralName: 'data-roles';
    displayName: 'data-role';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    role: Attribute.String;
    participants: Attribute.Relation<
      'api::data-role.data-role',
      'manyToMany',
      'api::nwc-participant.nwc-participant'
    >;
    oralhistory_role_toggle: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-role.data-role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'data-spouse';
    pluralName: 'data-spouses';
    displayName: 'data-spouse';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    last_name: Attribute.String;
    first_name: Attribute.String;
    middle_name_initial_1: Attribute.String;
    middle_name_initial_2: Attribute.String;
    nickname: Attribute.String;
    suffix: Attribute.String;
    professions: Attribute.Text;
    political_offices: Attribute.Text;
    participant: Attribute.Relation<
      'api::data-spouse.data-spouse',
      'manyToOne',
      'api::nwc-participant.nwc-participant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-spouse.data-spouse',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'email-template';
    pluralName: 'email-templates';
    displayName: 'email-template';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    template: Attribute.String & Attribute.Required;
    bcc: Attribute.String;
    subject: Attribute.String & Attribute.Required;
    text: Attribute.Text & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::email-template.email-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::email-template.email-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFormForm extends Schema.CollectionType {
  collectionName: 'forms';
  info: {
    singularName: 'form';
    pluralName: 'forms';
    displayName: 'form-corrections';
    name: 'Forms';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Email: Attribute.String;
    Name: Attribute.String;
    Affiliation: Attribute.String;
    Page: Attribute.String;
    Feature: Attribute.String;
    Corrections: Attribute.Text;
    Source: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::form.form', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::form.form', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiFormDonatepaperFormDonatepaper
  extends Schema.CollectionType {
  collectionName: 'form_donatepapers';
  info: {
    singularName: 'form-donatepaper';
    pluralName: 'form-donatepapers';
    displayName: 'form-donatepaper';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    role_at_nwc: Attribute.String;
    address: Attribute.Text;
    phone: Attribute.String;
    email: Attribute.Email;
    comments: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::form-donatepaper.form-donatepaper',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::form-donatepaper.form-donatepaper',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFormMoreideaFormMoreidea extends Schema.CollectionType {
  collectionName: 'form_moreideas';
  info: {
    singularName: 'form-moreidea';
    pluralName: 'form-moreideas';
    displayName: 'form-moreideas';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Name: Attribute.String;
    Affiliation: Attribute.String;
    Address: Attribute.String;
    Phone: Attribute.String;
    Email: Attribute.Email;
    Comments: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::form-moreidea.form-moreidea',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::form-moreidea.form-moreidea',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHomeHighlightHomeHighlight extends Schema.CollectionType {
  collectionName: 'home_highlights';
  info: {
    singularName: 'home-highlight';
    pluralName: 'home-highlights';
    displayName: 'Home-highlights';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Featured: Attribute.Boolean;
    Thumbnail: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    ShortTitle: Attribute.String;
    home_highlights_link: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::home-highlight.home-highlight',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::home-highlight.home-highlight',
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
    singularName: 'list-of-participant';
    pluralName: 'list-of-participants';
    displayName: 'list-of-participants';
    name: 'List_of_Participants';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    FirstName: Attribute.String;
    LastName: Attribute.String;
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
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::list-of-participant.list-of-participant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'nwc-participant';
    pluralName: 'nwc-participants';
    displayName: 'data-participant';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    last_name: Attribute.String;
    first_name: Attribute.String;
    middle_name_initial_1: Attribute.String;
    middle_name_initial_2: Attribute.String;
    nickname: Attribute.String;
    suffix: Attribute.String;
    represented_state: Attribute.String;
    birth_month: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 12;
        },
        number
      >;
    birth_day: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 31;
        },
        number
      >;
    birth_ca: Attribute.Boolean;
    birth_year: Attribute.Integer;
    age_range: Attribute.String;
    age_in_1977: Attribute.Integer;
    death_month: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 12;
        },
        number
      >;
    death_day: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 31;
        },
        number
      >;
    death_year: Attribute.Integer;
    place_of_birth: Attribute.String;
    marital_classification: Attribute.String;
    religion: Attribute.String;
    gender: Attribute.String;
    sexual_orientation: Attribute.String;
    has_children: Attribute.Boolean;
    total_number_of_children: Attribute.Integer;
    residence_in_1977s: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToMany',
      'api::data-residence-in-1977.data-residence-in-1977'
    >;
    spouses: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToMany',
      'api::data-spouse.data-spouse'
    >;
    basic_races: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-basic-race.data-basic-race'
    >;
    races: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-race.data-race'
    >;
    highest_level_of_education_attained: Attribute.String;
    high_school: Attribute.String;
    educations: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToMany',
      'api::data-education.data-education'
    >;
    military_service: Attribute.Boolean;
    careers: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToMany',
      'api::data-career.data-career'
    >;
    union_member: Attribute.Boolean;
    income_level_dollar_amount: Attribute.Decimal;
    income_level: Attribute.String;
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
    self_identified_feminist: Attribute.Boolean;
    federal_level_commission: Attribute.Boolean;
    state_level_commission: Attribute.Boolean;
    county_level_commission: Attribute.Boolean;
    city_level_commission: Attribute.Boolean;
    national_advisory_committee: Attribute.Boolean;
    leadership_in_organizations: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToMany',
      'api::data-leadership-in-organization.data-leadership-in-organization'
    >;
    organizational_politicals: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-organizational-political.data-organizational-political'
    >;
    roles: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-role.data-role'
    >;
    votes_received_at_state_meeting_for_nwc_delegate_alternate: Attribute.BigInteger;
    planks_fors: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-plank.data-plank'
    >;
    planks_against: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-plank.data-plank'
    >;
    planks_spoke_fors: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'manyToMany',
      'api::data-plank.data-plank'
    >;
    lat: Attribute.Float;
    lon: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::nwc-participant.nwc-participant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiParticipantParticipant extends Schema.CollectionType {
  collectionName: 'participants';
  info: {
    singularName: 'participant';
    pluralName: 'participants';
    displayName: 'old_participant';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    age_in_1977: Attribute.Integer;
    gender: Attribute.String;
    marital_classification: Attribute.String;
    median_household_income_of_place_of_residence: Attribute.Integer;
    name_of_spouse: Attribute.String;
    place_of_birth: Attribute.String;
    residence_in_1977: Attribute.String;
    sexual_orientation: Attribute.String;
    state: Attribute.String;
    total_number_of_children: Attribute.Integer;
    total_population_of_place_of_residence: Attribute.Integer;
    race: Attribute.JSON;
    poli: Attribute.JSON;
    edc: Attribute.JSON;
    orgs: Attribute.JSON;
    first_name: Attribute.String;
    last_name: Attribute.String;
    participant_id: Attribute.String;
    location_of_residence_in1977: Attribute.JSON;
    import_note: Attribute.Text;
    leadership: Attribute.JSON;
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
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::participant.participant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::participant.participant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::contact.contact': ApiContactContact;
      'api::content-about.content-about': ApiContentAboutContentAbout;
      'api::content-about-collaborator.content-about-collaborator': ApiContentAboutCollaboratorContentAboutCollaborator;
      'api::content-about-project-lead.content-about-project-lead': ApiContentAboutProjectLeadContentAboutProjectLead;
      'api::content-discover-stories-main.content-discover-stories-main': ApiContentDiscoverStoriesMainContentDiscoverStoriesMain;
      'api::content-discover-story.content-discover-story': ApiContentDiscoverStoryContentDiscoverStory;
      'api::content-essay.content-essay': ApiContentEssayContentEssay;
      'api::content-footer.content-footer': ApiContentFooterContentFooter;
      'api::content-home.content-home': ApiContentHomeContentHome;
      'api::content-home-carousel.content-home-carousel': ApiContentHomeCarouselContentHomeCarousel;
      'api::content-home-map.content-home-map': ApiContentHomeMapContentHomeMap;
      'api::content-how-to-contribute.content-how-to-contribute': ApiContentHowToContributeContentHowToContribute;
      'api::content-how-to-contribute-resource.content-how-to-contribute-resource': ApiContentHowToContributeResourceContentHowToContributeResource;
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
      'api::form.form': ApiFormForm;
      'api::form-donatepaper.form-donatepaper': ApiFormDonatepaperFormDonatepaper;
      'api::form-moreidea.form-moreidea': ApiFormMoreideaFormMoreidea;
      'api::home-highlight.home-highlight': ApiHomeHighlightHomeHighlight;
      'api::list-of-participant.list-of-participant': ApiListOfParticipantListOfParticipant;
      'api::nwc-participant.nwc-participant': ApiNwcParticipantNwcParticipant;
      'api::participant.participant': ApiParticipantParticipant;
    }
  }
}
