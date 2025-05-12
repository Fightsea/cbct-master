import { Gender, Position } from '@cbct/enum/user';
import { TreatmentStatus } from '@cbct/enum/patient';
import { Role } from '@cbct/enum/clinicMember';
import { CbctAiModel, CbctAiOutputStatus } from '@cbct/enum/cbct';
import { DiagnosisAnalysisType } from '@cbct/enum/diagnosisAnalysis';

type ModelBase = {
  id: uuid;
  createdAt: datetime;
  updatedAt: datetime;
}

type SoftDeleteModelBase = ModelBase & {
  deletedAt: Nullable<datetime>;
}

type FileModelBase = ModelBase & FileMeta;

declare global {
  namespace Model {
    interface Clinic extends SoftDeleteModelBase {
      name: string;
      taxId: string;
      phone: string;
      address: string;
      users?: ClinicMember[];
      patients?: Patient[];
    }

    interface User extends SoftDeleteModelBase {
      name: string;
      email: string;
      password: string;
      position: Position;
      idNumber: string;
      gender: Gender;
      birthday: date;
      clinics?: ClinicMember[];
    }

    interface ClinicMember extends ModelBase {
      clinicId: uuid;
      clinic?: Clinic;
      userId: uuid;
      user?: User;
      role: Role;
      isOwner: boolean;
    }

    interface Patient extends SoftDeleteModelBase {
      pinned: boolean;
      serialNumber: string;
      email: string;
      idNumber: string;
      treatmentStatus: TreatmentStatus;
      firstName: string;
      lastName: string;
      gender: Gender;
      birthday: date;
      phone: string;
      height: number;
      weight: number;
      note: string;
      clinicId: uuid;
      clinic?: Clinic[];
      tags?: Tag[];
    }

    interface Tag extends SoftDeleteModelBase {
      name: string;
      color: string;
      clinicId: uuid;
      clinic?: Clinic;
    }

    interface PatientTag extends ModelBase {
      patientId: uuid;
      patient?: Patient;
      tagId: uuid;
      tag?: Tag;
    }

    interface Diagnosis extends ModelBase {
      datetime: datetime;
      note: string;
      patientId: uuid;
      patient?: Patient;
      userId: uuid;
      user?: User;
      tags?: Tag[];
    }

    interface DiagnosisTag extends ModelBase {
      diagnosisId: uuid;
      diagnosis?: Diagnosis;
      tagId: uuid;
      tag?: Tag;
    }

    interface PatientPhoto extends FileModelBase {
      type: string;
      patientId: uuid;
      patient?: Patient;
    }

    interface XrayRecord extends ModelBase {
      date: date;
      patientId: uuid;
      patient?: Patient;
      images?: XrayImage[];
    }

    interface XrayImage extends FileModelBase {
      recordId: uuid;
      record?: XrayRecord;
    }

    interface OralScanRecord extends ModelBase {
      date: date;
      patientId: uuid;
      patient?: Patient;
      files?: OralScanFile[];
    }

    interface OralScanFile extends FileModelBase {
      recordId: uuid;
      record?: OralScanRecord;
    }

    interface CbctRecord extends ModelBase {
      date: date;
      patientId: uuid;
      patient?: Patient;
      images?: CbctImage[];
    }

    interface CbctDisplayView extends ModelBase {
      resource: Url;
      recordId: uuid;
      record?: CbctRecord;
    }

    interface CbctImage extends FileModelBase {
      recordId: uuid;
      record?: CbctRecord;
    }

    interface CbctAiOutput extends ModelBase {
      date: date;
      model: CbctAiModel;
      status: CbctAiOutputStatus;
      risk: Nullable<string>;
      phenotype: Nullable<string>;
      phenotypeImageUrl: Nullable<Url>;
      prescription: Nullable<string>;
      treatmentDescription: Nullable<string>;
      treatmentImageUrl: Nullable<Url>;
      recordId: uuid;
      record?: CbctRecord;
      files?: CbctAiOutputFile[];
    }

    interface CbctAiOutputFile extends FileModelBase {
      outputId: uuid;
      output?: CbctAiOutput;
    }

    interface ClinicPhoto extends FileModelBase {
      clinicId: uuid;
      clinic?: Clinic;
    }
  }

  namespace View {
    interface DiagnosisAnalysis {
      date: date;
      type: DiagnosisAnalysisType;
      subject: string;
      description: string;
      patientId: uuid;
    }
  }
}

export {};
