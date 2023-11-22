import { NextFunction ,Request,Response } from "express";
import Category from "../models/category";
import ApiError from "../errors/ApiError";

export const getAllcategories =async (  req:Request ,
    res: Response,
    next: NextFunction
    ) => {
    {
        try {
            const categories= await Category.find()
            res.status(200).json(categories)
          
         } catch(error){
            next(error);
         }

    
}}
export const getcategory =async (  req:Request ,
    res: Response,
    next: NextFunction
    ) => {
    {
        try {
            const categoryId =req.params.categoryId
            const category= await Category.findById(categoryId)
            if (!category){
                next(ApiError.badRequest('category not found'))
            return
            }
            res.status(200).json(category)
            
         } catch(error){
            next(error);
         }
            
       

    
}}
export const postcategory =async (  req:Request ,
    res: Response,
    next: NextFunction
    ) => {
        {
            try {
                const name = req.body.name
                
                if(!name){
                    next(ApiError.badRequest('Name is requried'))
                    return
                    
                }
            
                const category =new Category({
                name,
            })
            
            await category.save()
            
            res.status(201).json({
                status:true,
                name,
                category,
            })
            
        } catch(error){
            next(error);
        }
        
        
        
        
    }}
      
    
    export const deletecategory =async (  req:Request ,
        res: Response,
        next: NextFunction
        ) => {
        {
            try {
                    const {categoryId} = req.params
                    await Category.deleteOne({
                        _id:categoryId,
                    })
                    res.status(204).send()
            }
                
              catch(error){
                next(error);
             }
                
           
    
        
    }}

    export const putcategory =async (  req:Request ,
        res: Response,
        next: NextFunction
        ) => {
        {
            try {
                const UpdateName =req.body.name
                const {categoryId} = req.params
                const UpdateCategory= await Category.findByIdAndUpdate(categoryId,
                    {name:UpdateName},
                    {
                        new:true,
                    })
                res.json({
                    category:UpdateCategory,
                })
            }
                
              catch(error){
                next(error);
             }
                
           
    
        
    }}


