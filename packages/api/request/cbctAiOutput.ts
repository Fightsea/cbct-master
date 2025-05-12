import { z } from 'zod';
import { CbctAiModel } from '@cbct/enum/cbct';

export const createRequestBodySchema = z.object({
  model: z.nativeEnum(CbctAiModel),
  recordId: z.string().uuid()
}).strict();

export const completeRequestBodySchema = z.object({
  statusCode: z.number(),
  user_id: z.string(),
  risk: z.string().nullish(),
  phenotype: z.string(),
  phenotype_pic: z.string().nullish(),
  treatment_description: z.string(),
  treatment_pic: z.string().nullish(),
  encoded_prescription: z.string(),
  segmentation_results: z.string(),
  reconstruction_params: z.object({
    shape: z.array(z.number()),
    props: z.object({
      sitk_stuff: z.object({
        spacing: z.array(z.number()),
        origin: z.array(z.number()),
        direction: z.array(z.number())
      }),
      shape_before_cropping: z.array(z.number()),
      bbox_used_for_cropping: z.array(z.array(z.number())),
      shape_after_cropping_and_before_resampling: z.array(z.number())
    })
  }),
  landmark_co_results: z.object({
    landmarks: z.array(z.object({
      name: z.string(),
      coordinates: z.object({
        x: z.number(),
        y: z.number(),
        z: z.number()
      })
    })),
    metadata: z.object({
      units: z.object({
        x: z.string(),
        y: z.string(),
        z: z.string()
      }),
      count: z.number()
    })
  })
}).strict();

export type CreateRequest = z.infer<typeof createRequestBodySchema>;
export type CompleteRequest = z.infer<typeof completeRequestBodySchema>;
