import z from "zod";

export const FishSchema = z.object({
  id: z.number(),
  name: z.string(),
  weight_kg: z.number(),
  catch_date: z.string(),
  location: z.string(),
  grade: z.string(),
  price_per_kg: z.number(),
  is_available: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const SegmentSchema = z.object({
  id: z.number(),
  fish_id: z.number(),
  name: z.string(),
  segment_type: z.string(),
  weight_kg: z.number(),
  position_x: z.number(),
  position_y: z.number(),
  width: z.number(),
  height: z.number(),
  is_available: z.number(),
  reserved_until: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const OrderSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  fish_id: z.number(),
  segment_ids: z.string(),
  total_weight_kg: z.number(),
  total_price: z.number(),
  customer_name: z.string(),
  customer_email: z.string(),
  customer_phone: z.string().nullable(),
  delivery_address: z.string().nullable(),
  delivery_date: z.string().nullable(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateOrderSchema = z.object({
  fishId: z.number(),
  segmentIds: z.array(z.number()),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  deliveryAddress: z.string().optional(),
  deliveryDate: z.string().optional(),
});

export type Fish = z.infer<typeof FishSchema>;
export type Segment = z.infer<typeof SegmentSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
