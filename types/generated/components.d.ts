import type { Attribute, Schema } from '@strapi/strapi';

export interface EssaysCaptionedImage extends Schema.Component {
  collectionName: 'components_general_captioned_images';
  info: {
    description: '';
    icon: 'image';
    name: 'CaptionedImage';
  };
  attributes: {
    Image: Attribute.Media<'images' | 'files' | 'videos'>;
    ImageAlt: Attribute.String;
    ImgCaption: Attribute.String;
    ImgCredit: Attribute.String;
    ImgCreditMore: Attribute.String;
  };
}

export interface EssaysSection extends Schema.Component {
  collectionName: 'components_general_sections';
  info: {
    description: '';
    icon: 'text-height';
    name: 'Section';
  };
  attributes: {
    SectionText: Attribute.RichText;
    SectionTitle: Attribute.String;
  };
}

export interface GeneralCareer extends Schema.Component {
  collectionName: 'components_general_careers';
  info: {
    description: '';
    icon: 'address-book';
    name: 'Career';
  };
  attributes: {
    text: Attribute.String;
  };
}

export interface GeneralDocument extends Schema.Component {
  collectionName: 'components_general_documents';
  info: {
    icon: 'file-pdf';
    name: 'DOCUMENT';
  };
  attributes: {
    PDF: Attribute.Media<'images' | 'files' | 'videos'>;
    THUMBNAIL: Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface GeneralFiles extends Schema.Component {
  collectionName: 'components_general_files';
  info: {
    description: '';
    displayName: 'files';
    icon: 'alien';
  };
  attributes: {
    file: Attribute.Media<'files'>;
    link_to_form: Attribute.Enumeration<
      [
        'Corrections',
        'More Ideas',
        'Donate Papers',
        'Participant Inquiry',
        'Researcher Inquiry',
        'Educator Inquiry',
        'Student Inquiry',
        'Archivist Inquiry'
      ]
    >;
    title: Attribute.String;
  };
}

export interface GeneralPrimaryDocuments extends Schema.Component {
  collectionName: 'components_general_primary_documents';
  info: {
    icon: 'id-card';
    name: 'PrimaryDocuments';
  };
  attributes: {
    PDF: Attribute.Media<'images' | 'files' | 'videos'>;
    THUMBNAIL: Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface GeneralRole extends Schema.Component {
  collectionName: 'components_general_roles';
  info: {
    description: '';
    icon: 'scroll';
    name: 'role';
  };
  attributes: {
    text: Attribute.String;
  };
}

export interface GeneralSource extends Schema.Component {
  collectionName: 'components_general_sources';
  info: {
    description: '';
    icon: 'book-medical';
    name: 'source';
  };
  attributes: {
    text: Attribute.Text;
  };
}

export interface GeneralSources extends Schema.Component {
  collectionName: 'components_sources_sources';
  info: {
    description: '';
    displayName: 'General.map-sources';
  };
  attributes: {
    Date: Attribute.String;
    Description: Attribute.Text;
    FirstName: Attribute.String;
    LastName: Attribute.String;
    SourceName: Attribute.String;
    Title: Attribute.String;
  };
}

export interface GeneralUsertags extends Schema.Component {
  collectionName: 'components_general_usertags';
  info: {
    description: '';
    icon: 'tag';
    name: 'usertags';
  };
  attributes: {
    text: Attribute.String;
  };
}

export interface GeneralVideoAudio extends Schema.Component {
  collectionName: 'components_general_video_audios';
  info: {
    icon: 'closed-captioning';
    name: 'VideoAudio';
  };
  attributes: {
    Title: Attribute.String;
    VideoAudioURL: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'essays.captioned-image': EssaysCaptionedImage;
      'essays.section': EssaysSection;
      'general.career': GeneralCareer;
      'general.document': GeneralDocument;
      'general.files': GeneralFiles;
      'general.primary-documents': GeneralPrimaryDocuments;
      'general.role': GeneralRole;
      'general.source': GeneralSource;
      'general.sources': GeneralSources;
      'general.usertags': GeneralUsertags;
      'general.video-audio': GeneralVideoAudio;
    }
  }
}
