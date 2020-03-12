class RequestController < ApplicationController

    def new
        @member_request = MemberRequest.new
    end

    def create
        @member_request = MemberRequest.create(request_params)
        @member_request.approved = false
        if @member_request.valid? && @member_request.save
            redirect_to confirm_request_path
        end
    end

    private
    def request_params
        params.require(:member_request).permit(:first_name, :last_name, :email, :phone, :year_graduated, :address, :country, :password_pref)
    end

end
