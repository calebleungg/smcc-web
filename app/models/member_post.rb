class MemberPost < ApplicationRecord
    belongs_to :user

    def poster
        return User.find(self.user_id)
    end
end
