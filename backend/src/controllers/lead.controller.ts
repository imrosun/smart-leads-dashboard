import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const createLead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const lead = await Lead.create(req.body);
  res.status(201).json({ status: 'success', data: { lead } });
});

export const getLeads = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { status, source, search, sort, page = 1, limit = 10 } = req.query;

  let queryObj: any = {};

  if (status) queryObj.status = status;
  if (source) queryObj.source = source;
  if (search) {
    queryObj.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  let query = Lead.find(queryObj);

  if (sort === 'oldest') {
    query = query.sort('createdAt');
  } else {
    query = query.sort('-createdAt'); // Latest default
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  query = query.skip(skip).limit(limitNum);

  const [leads, total] = await Promise.all([
    query,
    Lead.countDocuments(queryObj)
  ]);

  res.status(200).json({
    status: 'success',
    results: leads.length,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    },
    data: { leads },
  });
});

export const getLead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return next(new AppError('No lead found with that ID', 404));
  res.status(200).json({ status: 'success', data: { lead } });
});

export const updateLead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!lead) return next(new AppError('No lead found with that ID', 404));
  res.status(200).json({ status: 'success', data: { lead } });
});

export const deleteLead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return next(new AppError('No lead found with that ID', 404));
  res.status(204).json({ status: 'success', data: null });
});
