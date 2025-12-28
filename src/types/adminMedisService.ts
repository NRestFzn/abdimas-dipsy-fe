export interface Questionnaire {
  id: string;
  title: string;
  description: string;
  status: 'publish' | 'draft';
  riskThreshold?: number;
  cooldownInMinutes?: number;
  createdAt: string;
  updatedAt: string;
  questions?: QuestionnaireQuestion[];
}

export interface GetQuestionnaireParams {
  page: number;
  pageSize: number;
  title?: string;
  description?: string;
  status?: string;
  order?: string;
}

export interface PaginatedResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
}

export interface RTData {
  rtId: string;
  rtName: number;
  userCount: number;
  submitCount: number;
  stableMentalCount: number;
  unStableMentalCount: number;
  unStableMentalPercentage: number;
}

export interface RWSummary {
  summarize: {
    userCount: number;
    submitCount: number;
    stableMentalCount: number;
    unStableMentalCount: number;
    unStableMentalPercentage: number;
  };
  perRt: RTData[];
}

export interface QuestionnaireSummary {
  summarize: {
    userCount: number;
    submitCount: number;
    stableMentalCount: number;
    unStableMentalCount: number;
    unStableMentalPercentage: number;
  };
  perRw: RWSectionData[];
}

export interface UserSummaryResponse {
  UserId: string;
  fullname: string;
  summarize: {
    submitCount: number;
    stableMentalCount: number;
    unStableMentalCount: number;
    unStableMentalPercentage: number;
  };
  submissions: Array<{
    submissionId: string;
    submissionDate: string;
    trueCount: string;
    isMentalUnStable: number;
  }>;
}

export interface SubmissionDetailResponse {
  id: string;
  trueCount: number;
  falseCount: number;
  answeredCount: number;
  isMentalUnstable: boolean;
  UserId: string;
  QuestionnaireId: string;
  createdAt: string;
  questionnaireAnswer: Array<{
    id: string;
    answerValue: string;
    questionnaireQuestion: {
      id: string;
      questionText: string;
      order: number;
    };
  }>;
  user?: {
    fullname: string;
  };
}

export interface RWSectionData {
  name: string;
  id: string;
  rwId: string;
  rwName: number;
  rtCount: number;
  userCount: number;
  submitCount: number;
  stableMentalCount: number;
  unStableMentalCount: number;
  unStableMentalPercentage: number;
}

export interface QuestionnaireQuestion {
  id: string;
  questionText: string;
  questionType: string;
  status: string;
  QuestionnaireId: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionPayload {
  questionText: string;
  questionType: 'radio' | 'checkbox' | 'text';
  status: 'publish' | 'draft';
  QuestionnaireId: string;
  order: number;
}

export interface BulkUpdateQuestionPayload {
  id: string;
  questionText: string;
  questionType: string;
  status: 'publish' | 'draft';
  order: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface WargaData {
  id: string;
  nama: string;
  tanggalTerakhir: string;
  tanggalDisplay: string;
  statusMental: 'Stabil' | 'Tidak Stabil';
}

export interface RTDetail {
  rtId: string;
  rtName: string;
  warga: WargaData[];
}

export interface WargaHistory {
  id: string;
  tanggal: string;
  skor: number;
  status: string;
  detailJawaban: Array<{
    questionId: string;
    questionText: string;
    answer: string;
  }>;
}

export interface CreateQuestionnairePayload {
  title: string;
  description: string;
  riskThreshold: number | 0;
  status: 'draft' | 'publish';
  cooldownInMinutes: number | 0;
}

export interface UpdateQuestionnairePayload {
  title: string;
  description: string;
  status: 'draft' | 'publish';
  riskThreshold: number | 0;
  cooldownInMinutes: number | 0;
}

export interface RTSummary {
  summarize: {
    userCount: number;
    submitCount: number;
    stableMentalCount: number;
    unStableMentalCount: number;
    unStableMentalPercentage: number;
  };
  users: Array<{
    UserId: string;
    fullname: string;
    nik?: string;
    lastSubmissionDate: string;
  }>;
}

export interface QueryParams {
  RukunWargaId?: string;
  RukunTetanggaId?: string;
  startDate?: string;
  endDate?: string;
}

export interface SummarizeAllResponse {
  statusCode: number;
  message: string;
  data: {
    summarize: {
      userCount: number;
      submitCount: number;
      stableMentalCount: number;
      unStableMentalCount: number;
      unStableMentalPercentage: number;
    };
    perRw: RWSectionData[];
  };
}

export interface GetAllRWResponse {
  statusCode: number;
  message: string;
  data: RWSectionData[];
  metadata: {
    rtCount: number;
    userCount: number;
  };
}

export interface AdminProfile {
  id: string;
  fullname: string;
  email: string;
  gender: 'm' | 'f';
  birthDate: string;
  profilePicture?: string;
  role: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface UpdateAdminProfilePayload {
  fullname: string;
  gender: 'm' | 'f';
  birthDate: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
