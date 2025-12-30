import type { Schema, Attribute } from '@strapi/strapi';

export interface GeneralVideoAudio extends Schema.Component {
  collectionName: 'components_general_video_audios';
  info: {
    name: 'VideoAudio';
    icon: 'closed-captioning';
  };
  attributes: {
    Title: Attribute.String;
    VideoAudioURL: Attribute.String;
  };
}

export interface GeneralUsertags extends Schema.Component {
  collectionName: 'components_general_usertags';
  info: {
    name: 'usertags';
    icon: 'tag';
    description: '';
  };
  attributes: {
    text: Attribute.String;
  };
}

export interface GeneralSources extends Schema.Component {
  collectionName: 'components_sources_sources';
  info: {
    displayName: 'General.map-sources';
    description: '';
  };
  attributes: {
    LastName: Attribute.String;
    FirstName: Attribute.String;
    Title: Attribute.String;
    Date: Attribute.String;
    SourceName: Attribute.String;
    Description: Attribute.Text;
  };
}

export interface GeneralSource extends Schema.Component {
  collectionName: 'components_general_sources';
  info: {
    name: 'source';
    icon: 'book-medical';
    description: '';
  };
  attributes: {
    text: Attribute.Text;
  };
}

export interface GeneralRole extends Schema.Component {
  collectionName: 'components_general_roles';
  info: {
    name: 'role';
    icon: 'scroll';
    description: '';
  };
  attributes: {
    text: Attribute.String;
  };
}

export interface GeneralPrimaryDocuments extends Schema.Component {
  collectionName: 'components_general_primary_documents';
  info: {
    name: 'PrimaryDocuments';
    icon: 'id-card';
  };
  attributes: {
    THUMBNAIL: Attribute.Media<'images' | 'files' | 'videos'>;
    PDF: Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface GeneralFiles extends Schema.Component {
  collectionName: 'components_general_files';
  info: {
    displayName: 'files';
    icon: 'alien';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    file: Attribute.Media<'files'>;
    link_to_form: Attribute.Enumeration<
      [
        'Corrections',
        'More Ideas',
        'Donate Papers',
        'Participant Inquiry',
        'Researcher Inquiry',
        'Educator Inquiry',
        'Student Inquiry'
      ]
    >;
  };
}

export interface GeneralDocument extends Schema.Component {
  collectionName: 'components_general_documents';
  info: {
    name: 'DOCUMENT';
    icon: 'file-pdf';
  };
  attributes: {
    THUMBNAIL: Attribute.Media<'images' | 'files' | 'videos'>;
    PDF: Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface GeneralCareer extends Schema.Component {
  collectionName: 'components_general_careers';
  info: {
    name: 'Career';
    icon: 'address-book';
    description: '';
  };
  attributes: {
    text: Attribute.String;
  };
}

export interface EssaysSection extends Schema.Component {
  collectionName: 'components_general_sections';
  info: {
    name: 'Section';
    icon: 'text-height';
    description: '';
  };
  attributes: {
    SectionTitle: Attribute.String;
    SectionText: Attribute.RichText;
  };
}

export interface EssaysCaptionedImage extends Schema.Component {
  collectionName: 'components_general_captioned_images';
  info: {
    name: 'CaptionedImage';
    icon: 'image';
    description: '';
  };
  attributes: {
    Image: Attribute.Media<'images' | 'files' | 'videos'>;
    ImageAlt: Attribute.String;
    ImgCredit: Attribute.String;
    ImgCaption: Attribute.String;
    ImgCreditMore: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'general.video-audio': GeneralVideoAudio;
      'general.usertags': GeneralUsertags;
      'general.sources': GeneralSources;
      'general.source': GeneralSource;
      'general.role': GeneralRole;
      'general.primary-documents': GeneralPrimaryDocuments;
      'general.files': GeneralFiles;
      'general.document': GeneralDocument;
      'general.career': GeneralCareer;
      'essays.section': EssaysSection;
      'essays.captioned-image': EssaysCaptionedImage;
    }
  }
}
