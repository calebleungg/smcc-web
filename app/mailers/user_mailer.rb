class UserMailer < ApplicationMailer
    default :from => "notification@smcc.com"

    def request_email(request)
        @request = request
        admins = User.where(admin: true)
        admins.each do |admin|
            mail(:to => admin.email, :subject => "New member request: #{request.email}")
        end
    end

end
