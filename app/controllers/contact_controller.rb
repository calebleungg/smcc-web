class ContactController < ApplicationController

    def new
        @contact_request = ContactRequest.new
    end

    def create
        @contact_request = ContactRequest.create(contact_params)
        if @contact_request.valid? && @contact_request.save
            redirect_to confirm_request_path(:from => "contact")
        end
    end 

    private
    def contact_params
        params.require(:contact_request).permit(:name, :email, :phone, :message)
    end
    
end
