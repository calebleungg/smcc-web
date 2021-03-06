class AdminController < ApplicationController

    def manager
        @albums = Album.all
        @section1 = Section.find(1)
        @section2 = Section.find(2)
        @requests = MemberRequest.where(approved: false)
        @contacts = ContactRequest.all.order("created_at DESC")
    end

    def approve
        request = MemberRequest.find(params[:id])
        request.approved = true
        request.save
        User.create(
            first_name: params[:first_name],
            last_name: params[:last_name],
            email: params[:email],
            year_grad: params[:year_grad],
            phone: params[:phone],
            address: params[:address],
            password: params[:password],
            admin: false,
        )
        redirect_back(fallback_location: admin_path)
    end

    def decline
        MemberRequest.find(params[:id]).destroy
        redirect_back(fallback_location: admin_path)
    end
    
end
