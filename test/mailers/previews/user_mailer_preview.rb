# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview

    def request_email
        # Set up a temporary order for the preview
        request = MemberRequest.new(first_name: "Joe", last_name: "Smith", email: "joe@gmail.com", address: "1-2-3 Chuo, Tokyo, 333-0000", phone: "090-7777-8888", year_graduated: "2020", approved: false)
    
        UserMailer.request_email(request).deliver
    end
end
